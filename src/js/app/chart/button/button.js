import {Graph, Tween} from '../../../engine';
import config from '../../config';
import Tick from './tick';

export default class Button extends Graph {
  constructor(engine, parent, data, colId) {
    super(engine, parent);

    this.name = data.names[colId];
    this.colId = colId;

    this.fillColor = {r: 0, g: 0, b: 0};
    this.strokeColor = {r: 0, g: 0, b: 0};
    this.textColor = {r: 0, g: 0, b: 0};

    this.fillColorTween = new Tween(engine, this.fillColor);
    this.strokeColorTween = new Tween(engine, this.strokeColor);
    this.textColorTween = new Tween(engine, this.textColor);

    this.measureText(this.name, config.buttonTextStyle, this);
    this.width += 100;
    this.height *= 2;

    this.tick = new Tick(engine, this, data.colors[colId]);
    this.tick.x = this.height / 2;
    this.tick.y = this.height / 2;
    this.tick.width = this.height * 0.6;
    this.tick.maskColor = this.fillColor;

    this.isActive = true;
  }

  handleModeChange(mode, time = 0.3) {
    this.strokeColorTween.set(config[mode].button.stroke, time).start();
    this.fillColorTween.set(config[mode].button.fill, time).start();
    this.textColorTween.set(config[mode].button.text, time).start();

    this.tick.handleModeChange(mode);
  }

  toggleActive() {
    this.isActive = !this.isActive;
    this.tick.setActive(this.isActive);
  }

  render(ctx) {
    const {global: {x, y, width, height}, fillColor, strokeColor, textColor, tick} = this;
    const style = config.buttonTextStyle;
    const hh = height / 2;

    ctx.beginPath();
    ctx.arc(x + hh, y + hh, hh - 2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + width - hh, y + hh, hh - 2, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgb(${strokeColor.r},${strokeColor.g},${strokeColor.b})`;
    ctx.fillStyle = `rgb(${fillColor.r},${fillColor.g},${fillColor.b})`;
    ctx.fill();
    ctx.stroke();

    if (tick.animPercent !== 0) {
      const animColor = tick.animColor;
      const a = (1 - this.animPercent * this.animPercent) * animColor.a * 0.8;

      ctx.save();
      ctx.clip();

      ctx.beginPath();
      ctx.arc(x + hh, y + hh, 140 * tick.animPercent, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${animColor.r},${animColor.g},${animColor.b},${a})`;
      ctx.lineWidth = 30;
      ctx.stroke();

      ctx.restore();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = `rgb(${textColor.r},${textColor.g},${textColor.b})`;
    ctx.font = `${style.size}px ${style.family}`;
    ctx.fillText(this.name, x + 70, y + hh + style.size * 0.38);
  }
}
