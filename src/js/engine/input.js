import Signal from './signal';

export default class Input {
  constructor(engine) {
    this.engine = engine;
    this.graphs = [];
    this.downGraph = null;
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    this.isDown = false;
    this.isUp = true;
    this._fired = false;
    this.ticksAfterLastInput = 0;

    this.onDown = new Signal();
    this.onUp = new Signal();
    this.onMove = new Signal();

    [
      {down: 'mousedown', up: 'mouseup', move: 'mousemove'},
      // {down: 'vmousedown', up: 'vmouseup', move: 'vmousemove'},
      {down: 'touchstart', up: 'touchend', move: 'touchmove'},
    ].forEach(({down, up, move}) => {
      window.addEventListener(down, this.handleMouseDown.bind(this));
      window.addEventListener(up, this.handleMouseUp.bind(this));
      window.addEventListener(move, this.handleMouseMove.bind(this));
    });
  }

  add(graph) {
    this.graphs.push(graph);
  }

  handleMouseDown(e) {
    if (this._fired || this.ticksAfterLastInput < 2) return;
    this._fired = true;

    const touch = e.touches && e.touches[0] || e;
    const {graphs, engine: {viewPort}} = this;
    const x = (touch.clientX - viewPort.x) * viewPort.scale;
    const y = (touch.clientY - viewPort.y) * viewPort.scale;
    let i = graphs.length;

    while (i-- > 0) {
      if (graphs[i].contains(x, y)) {
        this.downGraph = graphs[i];
        break;
      }
    }

    this.isDown = true;
    this.isUp = false;
    this.x = x;
    this.y = y;

    (!this.downGraph || !this.downGraph.stopGlobalInput) && this.onDown.dispatch();
    this.downGraph && this.downGraph.onInputDown.dispatch();
  }

  handleMouseUp() {
    if (this._fired) return;
    this._fired = true;

    this.isDown = false;
    this.isUp = true;
    (!this.downGraph || !this.downGraph.stopGlobalInput) && this.onUp.dispatch();
    this.downGraph && this.downGraph.onInputUp.dispatch();
    this.downGraph = null;
  }

  handleMouseMove(e) {
    const touch = e.touches && e.touches[0] || e;
    const {viewPort} = this.engine;
    const x = (touch.clientX - viewPort.x) * viewPort.scale;
    const y = (touch.clientY - viewPort.y) * viewPort.scale;

    this.dx = x - this.x;
    this.dy = y - this.y;

    this.x = x;
    this.y = y;

    (!this.downGraph || !this.downGraph.stopGlobalInput) && this.onMove.dispatch();
    this.downGraph && this.downGraph.onInputMove.dispatch();
  }

  update() {
    this._fired = false;
    this.ticksAfterLastInput = this.isDown ? 0 : this.ticksAfterLastInput + 1;
  }
}
