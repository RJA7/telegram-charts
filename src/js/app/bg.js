import {Graph, Tween} from '../engine';
import config from './config';

export default class Bg extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.color = {r: 0, g: 0, b: 0};
    this.colorTween = new Tween(engine, this.color);
    engine.input.add(this);
  }

  handleResize(width, height) {
    super.handleResize(width, height);

    this.width = width;
    this.height = height;
  }

  handleModeChange(mode, time = 0.3) {
    this.colorTween.set(config[mode].bgColor, time).start();
  }

  render(ctx) {
    const {global, color} = this;

    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.fillRect(global.x, global.y, global.width, global.height);
  }
}
