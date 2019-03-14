import {Graph, Tween} from '../../../engine';
import config from '../../config';

export default class Tick extends Graph {
  constructor(engine, parent, color) {
    super(engine, parent);

    this.color = color;
    this.maskRadius = 0;
    this.maskColor = null;
    this.animPercent = 0;

    this.maskRadiusTween = new Tween(engine, this);
    this.animTween = new Tween(engine, this);
    this.animColor = config[config.mode.DAY].button.anim;
  }

  setActive(v) {
    this.animPercent = 0;
    this.maskRadiusTween.set({maskRadius: v ? 0 : 1}, 0.3, v ? Tween.sin.out : Tween.sin.out).start();
    this.animTween.set({animPercent: 1}, 0.5, Tween.sin.in).start();
  }

  handleModeChange(mode) {
    this.animColor = config[mode].button.anim;
  }

  render(ctx) {
    const {global: {x, y, width}} = this;

    ctx.beginPath();
    ctx.arc(x, y, width / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 8, y + 1);
    ctx.lineTo(x - 2, y + 6);
    ctx.lineTo(x + 9, y - 6);

    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    if (this.maskRadius > 0) {
      const maskColor = this.maskColor;

      ctx.beginPath();
      ctx.arc(x, y, (width - 5) / 2 * this.maskRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${maskColor.r},${maskColor.g},${maskColor.b})`;
      ctx.fill();
    }

    if (this.animPercent > 0) {
      const animColor = this.animColor;
      const a = (1 - this.animPercent * this.animPercent) * animColor.a;

      ctx.beginPath();
      ctx.arc(x, y, 60 * this.animPercent, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${animColor.r},${animColor.g},${animColor.b},${a})`;
      ctx.lineWidth = 20 - this.animPercent * 10;
      ctx.stroke();

      this.animPercent = this.animPercent === 1 ? 0 : this.animPercent;
    }
  }
}
