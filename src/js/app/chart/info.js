import {Graph} from '../../engine';
import config from '../config';

export default class Info extends Graph {
  constructor(engine, parent, axisY) {
    super(engine, parent);

    this.axisY = axisY;
    this.alpha = 0;
    this.boxFill = {r: 0, g: 0, b: 0};
    this.boxStroke = {r: 0, g: 0, b: 0};
    this.textColor = {r: 0, g: 0, b: 0};
    this.inputX = 0;

    engine.input.onDown.add(() => this.inputX = engine.input.x);
  }

  handleModeChange(mode) {
    this.boxFill = config[mode].info.boxFill;
    this.boxStroke = config[mode].info.boxStroke;
    this.textColor = config[mode].info.textColor;
  }

  update() {
    const {parent, engine: {input}} = this;

    if (input.downGraph === parent && parent.contains(input.x, input.y)) {
      this.alpha = Math.min(1, this.alpha + 0.1);
    } else {
      this.alpha = Math.max(0, this.alpha - 0.2);
    }
  }

  render(ctx) {
    if (this.alpha === 0) return;

    const {parent, parent: {global, cols, colX, rangeMinY}, axisY, alpha, boxFill, boxStroke, textColor} = this;
    this.inputX += (this.engine.input.x - this.inputX) * 0.2;
    const x = Math.max(global.x, Math.min(global.x + parent.width, this.inputX));
    const localX = (x - global.x) / global.scaleX + parent.range.minX;

    ctx.strokeStyle = `rgba(${axisY.lineColor.r},${axisY.lineColor.g},${axisY.lineColor.b},${alpha * axisY.lineColor.a})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, global.y);
    ctx.lineTo(x, global.y + parent.height);
    ctx.stroke();

    let countTexts = [];
    let nameTexts = [];
    let colors = [];

    for (let i = 0, l = cols.length; i < l; i++) {
      const col = cols[i];

      if (!col.isActive) continue;

      const localY = parent.interpolate(localX, colX.raw, col.raw);
      const y = global.y + (localY - rangeMinY) * global.scaleY;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${col.rgb.r},${col.rgb.g},${col.rgb.b},${alpha})`;
      ctx.fillStyle = `rgba(${boxFill.r},${boxFill.g},${boxFill.b},${alpha})`;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      countTexts.push(axisY.applyShortcut(localY, 2));
      nameTexts.push(col.name);
      colors.push(ctx.strokeStyle);
    }

    const date = new Date(localX);
    const textsWidth = countTexts.length * 80;
    let tx = Math.max(global.x + 186, Math.min(global.x + parent.width - textsWidth, x + 20));
    const ty = global.y + parent.height - 14;

    // box
    {
      const left = tx - 186;
      const right = tx + textsWidth;
      const top = ty - 28;
      const bottom = top + 64;
      const radius = 10;

      ctx.beginPath();
      ctx.moveTo(left + radius, top);
      ctx.arcTo(right, top, right, bottom, radius);
      ctx.arcTo(right, bottom, left, bottom, radius);
      ctx.arcTo(left, bottom, left, top, radius);
      ctx.arcTo(left, top, right, top, radius);
      ctx.fillStyle = `rgba(${boxFill.r},${boxFill.g},${boxFill.b},${alpha})`;
      ctx.strokeStyle = `rgba(${boxStroke.r},${boxStroke.g},${boxStroke.b},${alpha * boxStroke.a})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fill();
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(${textColor.r},${textColor.g},${textColor.b},${alpha})`;
    ctx.font = `bold 22px ${config.family.HELVETICA}`;
    ctx.fillText(`${config.days[date.getUTCDay()]}, ${config.months[date.getUTCMonth()]} ${date.getUTCDate()}`, tx - 40, ty);
    ctx.font = `bold 20px ${config.family.HELVETICA}`;
    ctx.fillText(`${date.getUTCFullYear()}`, tx - 40, ty + 25);
    ctx.textAlign = 'left';

    for (let i = 0, l = countTexts.length; i < l; i++) {
      ctx.fillStyle = colors[i];
      ctx.font = `bold 22px ${config.family.HELVETICA}`;
      ctx.fillText(countTexts[i], tx, ty);

      ctx.font = `20px ${config.family.HELVETICA}`;
      ctx.fillText(nameTexts[i], tx, ty + 25);

      tx += 80;
    }
  }
}
