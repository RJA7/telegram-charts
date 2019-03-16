import Graph from './graph';
import Input from './input';
import Tween from './tween';
import Signal from './signal';

export default class Engine {
  constructor() {
    const view = document.createElement('canvas');
    document.body.appendChild(view);

    const ctx = view.getContext('2d');
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    this.ctx = ctx;
    this.view = view;
    this.stage = new Graph(this);
    this.input = new Input(this);
    this.tweens = [];
    this.viewPort = {x: 0, y: 0, scale: 1};
    this.tick = this.tick.bind(this);

    window.addEventListener('resize', () => this.handleResize());
    this.handleResize();
    requestAnimationFrame(this.tick);
  }

  tick() {
    requestAnimationFrame(this.tick);

    const {stage, tweens, input, ctx} = this;
    input.update();

    if (input.ticksAfterLastInput > 30 && tweens.length === 0) return;

    // ctx.clearRect(0, 0, view.width, view.height);

    let i = tweens.length;
    while (i-- > 0) {
      const tw = tweens[i];
      tw.update();

      if (tw.ticksLeft <= 0) {
        tweens.splice(i, 1);
        tw.onComplete.dispatch();
      }
    }

    stage._update();
    stage._render(ctx, 0, 0, 1, 1, 1);
  }

  handleResize(width = window.innerWidth, height = window.innerHeight) {
    window.LP = width > height ? a => a : (a, b) => b;

    const mw = LP(width * 640 / height, width * 960 / height);
    const mh = LP(height * 960 / width, height * 640 / width);
    const scale = Math.max(mw / width, mh / height);

    const {view, viewPort, stage, input} = this;

    view.width = Math.ceil(width * scale);
    view.height = Math.ceil(height * scale);
    view.style.width = `${width}px`;
    view.style.height = `${height}px`;

    viewPort.x = 0;
    viewPort.y = 0;
    viewPort.scale = scale;

    stage.handleResize(view.width, view.height);
    input.handleResize();
  }
}

export {Graph, Tween, Signal};
