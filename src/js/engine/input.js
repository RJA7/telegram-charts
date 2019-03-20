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
    this._inputType = ''; // touch or mouse
    this.ticksAfterLastInput = 0;

    this.onDown = new Signal();
    this.onUp = new Signal();
    this.onMove = new Signal();

    [
      {down: 'mousedown', up: 'mouseup', move: 'mousemove'},
      {down: 'touchstart', up: 'touchend', move: 'touchmove'},
    ].forEach(({down, up, move}) => {
      window.addEventListener(down, this.handleMouseDown.bind(this));
      window.addEventListener(up, this.handleMouseUp.bind(this));
      window.addEventListener(move, this.handleMouseMove.bind(this));
    });
  }

  handleResize() {
    this._inputType = '';
    this.ticksAfterLastInput = 0;
  }

  add(graph) {
    this.graphs.push(graph);
  }

  remove(graph) {
    const index = this.graphs.indexOf(graph);
    index !== -1 && this.graphs.splice(index, 1);
  }

  handleMouseDown(e) {
    const inputType = e.touches && e.touches[0] ? 'touch' : 'mouse';
    this._inputType = this._inputType ? this._inputType : inputType;

    if (inputType !== this._inputType) return;

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

    const {downGraph, onDown} = this;
    (!downGraph || !downGraph.stopGlobalInput) && onDown.dispatch();
    downGraph && downGraph.onInputDown.dispatch();
  }

  handleMouseUp() {
    if (!this.isDown) return;

    const {downGraph, onUp} = this;
    this.isDown = false;
    this.isUp = true;
    (!downGraph || !downGraph.stopGlobalInput) && onUp.dispatch();
    downGraph && downGraph.onInputUp.dispatch();
    this.downGraph = null;
  }

  handleMouseMove(e) {
    const inputType = e.touches && e.touches[0] ? 'touch' : 'mouse';

    if (inputType !== this._inputType) return;

    const touch = e.touches && e.touches[0] || e;
    const {viewPort} = this.engine;
    const x = (touch.clientX - viewPort.x) * viewPort.scale;
    const y = (touch.clientY - viewPort.y) * viewPort.scale;

    this.dx = x - this.x;
    this.dy = y - this.y;

    this.x = x;
    this.y = y;

    const {downGraph, onMove} = this;
    (!downGraph || !downGraph.stopGlobalInput) && onMove.dispatch();
    downGraph && downGraph.onInputMove.dispatch();
  }

  update() {
    this.ticksAfterLastInput = this.isDown ? 0 : this.ticksAfterLastInput + 1;
  }
}
