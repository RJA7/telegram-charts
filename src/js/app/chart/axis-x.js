import {Graph, Tween} from '../../engine';
import config from '../config';

const dayMs = 1000 * 60 * 60 * 24;

export default class AxisX extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.fullWidth = 0;
    this.maxTexts = 7;

    this.xs = [];
    this.texts = [];
    this.alphas = [];

    this.textColor = {r: 0, g: 0, b: 0};
    this.textColorTween = new Tween(engine, this.textColor);
  }

  reset() {
    const {parent, xs, texts, alphas} = this;
    xs.length = texts.length = alphas.length = 0;

    const reserve = Math.ceil((parent.range.maxX - parent.range.minX) / dayMs / 5);
    const startX = (Math.floor(parent.range.minX / dayMs) - reserve) * dayMs;
    const endX = (Math.ceil(parent.range.maxX / dayMs) + reserve) * dayMs;

    this.fullWidth = endX - startX;

    for (let x = startX; x <= endX; x += dayMs) {
      const date = new Date(x);
      xs.push(x);
      texts.push(`${date.getUTCDate()} ${config.months[date.getUTCMonth()]}`);
      alphas.push(0);
    }
  }

  handleModeChange(mode, time = 0.3) {
    this.textColorTween.set(config[mode].axisTextColor, time).start();
  }

  render(ctx) {
    const {global: {x, y, scaleX}, parent, xs, texts, alphas, fullWidth, maxTexts, textColor} = this;
    const style = config.axisTextStyle;
    const color = `rgba(${textColor.r},${textColor.g},${textColor.b},`;

    ctx.font = `${style.size}px ${style.family}`;
    ctx.textAlign = 'center';

    const {range: {minX, maxX}} = parent;
    const curWidth = maxX - minX;
    const days = Math.ceil(curWidth / dayMs);

    let round = 1;
    while (round * maxTexts < days) round *= 2;
    round = Math.ceil(round);

    const step = Math.ceil(curWidth / fullWidth / maxTexts * texts.length / round) * round;

    for (let i = 0, l = texts.length; i < l; i += step) {
      alphas[i] = Math.min(1, alphas[i] + (xs[i] > minX && xs[i] < maxX ? 0.35 : 0));
    }

    for (let i = 0, l = texts.length; i < l; i++) {
      alphas[i] = Math.max(0, alphas[i] - 0.2);

      if (alphas[i] === 0) continue;

      ctx.fillStyle = `${color}${alphas[i]})`;
      ctx.fillText(texts[i], x + (-minX + xs[i]) * scaleX, y + 28);
    }
  }
}
