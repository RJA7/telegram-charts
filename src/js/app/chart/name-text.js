import {Graph, Tween} from '../../engine';
import config from '../config';

export default class NameText extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.text = '';
    this.color = {r: 0, g: 0, b: 0};
    this.colorTween = new Tween(engine, this.color);
  }

  setData(data) {
    this.text = data.name;
    this.measureText(this.text, config.chartNameStyle, this);
  }

  handleModeChange(mode, time = 0.3) {
    this.colorTween.set(config[mode].chartNameColor, time).start();
  }

  render(ctx) {
    const {global, color} = this;
    const style = config.chartNameStyle;

    ctx.font = `${LP(28, 24)}px ${style.family}`;
    ctx.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    ctx.alignText = 'left';
    ctx.fillText(this.text, global.x, global.y);
  }
}
