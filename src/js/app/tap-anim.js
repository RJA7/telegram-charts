import {Graph, Tween} from '../engine';
import config from './config';

export default class TapAnim extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.percent = 0;
    this.color = config[config.mode.DAY].tapAnimColor;
    this.tween = new Tween(engine, this);

    engine.input.onDown.add(this.handleInputDown, this);
    engine.input.onUp.add(this.handleInputUp, this);
  }

  handleInputDown() {
    this.tween.set({percent: 1}, 0.2, Tween.sin.out).start();
  }

  handleInputUp() {
    this.tween.set({percent: 0}, 0.2, Tween.sin.out).start();
  }

  handleModeChange(mode) {
    this.color = config[mode].tapAnimColor;
  }

  render(ctx) {
    if (this.percent === 0) return;

    const {engine: {input}, color} = this;

    ctx.beginPath();
    ctx.arc(input.x, input.y, this.percent * 50, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    ctx.fill();
  }
}
