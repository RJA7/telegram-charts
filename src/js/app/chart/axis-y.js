import {Graph, Tween} from '../../engine';
import config from '../config';

const shortcuts = ['', 'k', 'M', 'B', 'T'];

export default class AxisY extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.risingSprites = [];
    this.fallingSprites = [];
    this.textColor = {r: 0, g: 0, b: 0};
    this.lineColor = {r: 0, g: 0, b: 0, a: 0};
    this.textColorTween = new Tween(engine, this.textColor);
    this.lineColorTween = new Tween(engine, this.lineColor);
    this.shortcutIndex = 0;
    this.floatDigitsCount = 0;

    parent.onRangeYChange.add(this.handleRangeChange, this);
    parent.onRender.add(this.renderBg, this);
  }

  reset() {

  }

  handleRangeChange() {
    const {fallingSprites, risingSprites, parent: {stepsY, range: {minY, maxY}}} = this;
    const step = (maxY - minY) / stepsY;
    const hash = {};

    for (let i = 0, l = risingSprites.length; i < l; i++) {
      hash[risingSprites[i].y] = risingSprites[i];
    }

    risingSprites.length = 0;

    this.shortcutIndex = this.getShortcutIndex(minY + step);
    this.floatDigitsCount = 0;

    let y = minY;
    while (y < maxY) {
      const n = parseFloat(this.applyShortcut(y, this.shortcutIndex, 2));
      this.floatDigitsCount = Math.max(this.floatDigitsCount, this.getFloatDigitsCount(n));
      y += step;
    }

    for (let i = 0; i <= stepsY; i++) {
      const y = minY + step * i;

      if (hash[y]) {
        hash[y].text = this.applyShortcut(y);
        risingSprites.push(hash[y]);
        hash[y] = null;
      } else if (y === 0) {
        risingSprites.push({y, text: '0', alpha: 0});
      } else {
        risingSprites.push({y, text: this.applyShortcut(y), alpha: 0});
      }
    }

    for (let key in hash) {
      if (!hash.hasOwnProperty(key)) continue;
      hash[key] && fallingSprites.push(hash[key]);
    }
  }

  getShortcutIndex(number) {
    let shortcutIndex = 0;

    while (number > 100) {
      shortcutIndex++;
      number /= 1000;
    }

    return shortcutIndex;
  }

  getFloatDigitsCount(number) {
    let count = 0;

    while (number !== parseInt(number)) {
      number *= 10;
      count++;
    }

    return count;
  }

  applyShortcut(number, floatDigitsCount = this.floatDigitsCount) {
    if (number === 0) {
      return '0';
    }

    const {shortcutIndex} = this;

    let j = shortcutIndex;
    while (j--) number /= 1000;

    return `${number.toFixed(shortcutIndex === 0 ? 0 : floatDigitsCount)}${shortcuts[shortcutIndex]}`;
  }

  handleModeChange(mode, time = 0.3) {
    this.textColorTween.set(config[mode].axisTextColor, time).start();
    this.lineColorTween.set(config[mode].axisLineColor, time).start();
  }

  renderBg(ctx) {
    const {global: {x, y}, fallingSprites, risingSprites, parent: {rangeMinY, scaleY}, lineColor, width} = this;
    const sprites = [...fallingSprites, ...risingSprites];
    const color = `rgba(${lineColor.r},${lineColor.g},${lineColor.b},`;

    ctx.lineWidth = 3;

    for (let i = 0, l = sprites.length; i < l; i++) {
      const s = sprites[i];
      const sy = y + (-rangeMinY + s.y) * scaleY;
      ctx.strokeStyle = `${color}${s.alpha * lineColor.a})`;
      i === 1 ? ctx.lineWidth = 2 : '';

      ctx.beginPath();
      ctx.moveTo(x, sy);
      ctx.lineTo(x + width, sy);
      ctx.stroke();
    }
  }

  render(ctx) {
    const {global: {x, y}, fallingSprites, risingSprites, parent: {scaleY, rangeMinY}, textColor} = this;
    const style = config.axisTextStyle;
    const color = `rgba(${textColor.r},${textColor.g},${textColor.b},`;

    ctx.font = `${style.size}px ${style.family}`;
    ctx.textAlign = 'left';

    for (let i = fallingSprites.length - 1; i >= 0; i--) {
      const s = fallingSprites[i];
      s.alpha -= 0.1;

      if (s.alpha <= 0) {
        fallingSprites.pop();
        continue;
      }

      ctx.fillStyle = `${color}${s.alpha})`;
      ctx.fillText(s.text, x, y + s.y * scaleY);
    }

    for (let i = risingSprites.length - 1; i >= 0; i--) {
      const s = risingSprites[i];
      s.alpha = Math.min(1, s.alpha + 0.1);

      ctx.fillStyle = `${color}${s.alpha})`;
      ctx.fillText(s.text, x, y + (-rangeMinY + s.y) * scaleY - 6);
    }
  }
}

AxisY.shortcuts = shortcuts;
