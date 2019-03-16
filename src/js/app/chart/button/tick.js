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
    const {global: {x, y, width}, color, maskColor, maskRadius, animPercent, animColor} = this;

    ctx.beginPath();
    ctx.arc(x, y, width / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x - 8, y + 1);
    ctx.lineTo(x - 2, y + 6);
    ctx.lineTo(x + 9, y - 6);

    ctx.lineCap = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    if (maskRadius > 0) {
      ctx.beginPath();
      ctx.arc(x, y, (width - 5) / 2 * maskRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${maskColor.r},${maskColor.g},${maskColor.b})`;
      ctx.fill();
    }

    if (animPercent > 0) {
      const a = (1 - animPercent * animPercent) * animColor.a;

      ctx.beginPath();
      ctx.arc(x, y, 60 * animPercent, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${animColor.r},${animColor.g},${animColor.b},${a})`;
      ctx.lineWidth = 20 - animPercent * 10;
      ctx.stroke();

      this.animPercent = animPercent === 1 ? 0 : animPercent;
    }
  }
}
