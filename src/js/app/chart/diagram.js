import {Graph, Signal, Tween} from '../../engine';

const roundsY = [
  1, 2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 50, 60, 70, 75, 80, 100,
  150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 750, 800, 900, 1000,
];

export default class Diagram extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.colsHash = null;
    this.cols = null;
    this.colX = null;
    this.crop = null;
    this.range = {minX: 0, minY: 0, maxX: 0, maxY: 0};
    this.crop = {startPercentX: 0, endPercentX: 1};
    this.lineWidth = 2;

    this.stepsY = 5;
    this.yDelay = -1;
    this.onRangeYChange = new Signal();
    this.onRender = new Signal();

    this.rangeMinY = 0;
    this.scaleX = 1;
    this.scaleY = -1;

    this.scaleTween = new Tween(engine, this);
    this.cropTween = new Tween(engine, this.crop);
    this.cropTween.onUpdate.add(this.updateCrop, this);
  }

  setData(data) {
    this.colsHash = {};

    this.cols = data.columns
      .filter(col => col[0] !== data.types.x)
      .map(raw => {
        raw = raw.slice();
        const id = raw.shift();
        const color = data.colors[id];

        const col = {
          raw,
          color,
          name: data.names[id],
          slice: raw.slice(),
          isActive: true,
          alpha: 1,

          rgb: {
            r: Number(`0x${color.slice(1, 3)}`),
            g: Number(`0x${color.slice(3, 5)}`),
            b: Number(`0x${color.slice(5, 7)}`),
          },
        };

        col.alphaTween = new Tween(this.engine, col);
        this.colsHash[id] = col;

        return col;
      });

    const rawX = data.columns.filter(col => col[0] === data.types.x)[0].slice();
    rawX.shift();

    this.colX = {
      raw: rawX,
      slice: rawX.slice(),
    };

    this.refreshRangeX();
    this.refreshRangeY();

    this.scaleTween.stop();
    this.rangeMinY = this.range.minY;
    this.scaleX = this.width / (this.range.maxX - this.range.minX);
    this.scaleY = this.height / (this.range.maxY - this.range.minY);
    this.crop.startPercentX = 0;
    this.crop.endPercentX = 1;
  }

  refreshRangeX() {
    const {range, colX} = this;
    range.minX = colX.slice[0];
    range.maxX = colX.slice[colX.slice.length - 1];
  }

  refreshRangeY() {
    const {cols, range} = this;
    let i = cols.length;
    let maxY = -Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let hasActive = false;

    while (i--) {
      const col = cols[i];

      if (col.isActive) {
        hasActive = true;
        maxY = Math.max(maxY, ...col.slice);
        minY = Math.min(minY, ...col.slice);
      }
    }

    if (!hasActive) return;

    let step = 1;
    let j = 1;

    while (true) {
      const s = roundsY[j] || roundsY[j % roundsY.length] * 1000;
      j++;

      if (parseInt(s) !== s) continue;

      const yMin = Math.floor(minY / s) * s;
      step = s;

      if ((maxY - yMin) / s < this.stepsY) break;
    }

    minY = Math.floor(minY / step) * step;
    maxY = minY + step * this.stepsY;

    if (minY !== range.minY || maxY !== range.maxY) {
      range.minY = minY;
      range.maxY = maxY;

      clearTimeout(this.yDelay);
      this.yDelay = setTimeout(() => this.rangeYChange(), 0);
    }
  }

  rangeYChange() {
    const {scaleTween, range: {minY, maxY}, onRangeYChange, height} = this;

    scaleTween.set({
      scaleY: height / (maxY - minY),
      rangeMinY: minY,
    }, 0.1, Tween.sin.out).start();

    onRangeYChange.dispatch();
  }

  setCrop(startPercentX, endPercentX) {
    const {crop, cropTween} = this;
    const {startPercentX: sx, endPercentX: ex} = crop;
    crop.startPercentX = startPercentX;
    crop.endPercentX = endPercentX;

    this.updateCrop();
    this.refreshRangeY();

    crop.startPercentX = sx;
    crop.endPercentX = ex;
    cropTween.set({startPercentX, endPercentX}, 0.2, Tween.sin.out).start();
  }

  updateCrop() {
    const {colX, cols, range, crop} = this;
    const rawWidth = colX.raw[colX.raw.length - 1] - colX.raw[0];
    const startX = colX.raw[0] + rawWidth * crop.startPercentX;
    const endX = colX.raw[0] + rawWidth * crop.endPercentX;
    const startIndex = this.getInterpolationIndex(startX, colX.raw);
    const endIndex = this.getInterpolationIndex(endX, colX.raw);

    colX.slice = colX.raw.slice(Math.max(0, startIndex - 1), endIndex + 1);
    colX.slice[0] = startX;
    colX.slice[colX.slice.length - 1] = endX;

    for (let i = 0, l = cols.length; i < l; i++) {
      const col = cols[i];
      col.slice = col.raw.slice(Math.max(0, startIndex - 1), endIndex + 1);
      col.slice[0] = this.interpolate(startX, colX.raw, col.raw, startIndex);
      col.slice[col.slice.length - 1] = this.interpolate(endX, colX.raw, col.raw, endIndex);
    }

    this.refreshRangeX();
    this.anchorX = crop.startPercentX;
    this.scaleX = this.width / (range.maxX - range.minX);
  }

  getInterpolationIndex(x, rawX) {
    for (let i = 1, l = rawX.length; i < l; i++) {
      if (rawX[i] >= x) {
        return i;
      }
    }

    return 0;
  }

  interpolate(x, rawX, rawY, i = this.getInterpolationIndex(x, rawX)) {
    return i === 0 ? rawY[0] : rawY[i - 1] + (rawY[i] - rawY[i - 1]) * ((x - rawX[i - 1]) / (rawX[i] - rawX[i - 1]));
  }

  setColVisibility(colId, value) {
    const {range, colsHash, scaleTween} = this;

    const col = colsHash[colId];
    col.alphaTween.set({alpha: value ? 1 : 0}, value ? 0.2 : 0.1).start();
    col.isActive = value;

    this.refreshRangeY();

    scaleTween.set({scaleY: this.height / (range.maxY - range.minY)}, 0.2).start();
  }

  contains(inputX, inputY) {
    const {global: {x, y}} = this;
    return inputX > x && inputX < x + this.width && inputY < y && inputY > y + this.height;
  }

  render(ctx) {
    this.onRender.dispatch(ctx);

    const {colX: {slice: sliceX}, cols, global: {x, y, scaleX, scaleY}, range: {minX}, rangeMinY} = this;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = 'round';

    for (let i = 0, iLen = cols.length; i < iLen; i++) {
      const {slice, rgb, alpha} = cols[i];

      if (alpha === 0) continue;

      ctx.beginPath();
      ctx.moveTo(x + (sliceX[0] - minX) * scaleX, y + (slice[0] - rangeMinY) * scaleY);

      for (let j = 1, jLen = sliceX.length; j < jLen; j++) {
        ctx.lineTo(x + (sliceX[j] - minX) * scaleX, y + (slice[j] - rangeMinY) * scaleY);
      }

      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
      ctx.stroke();
    }
  }
}
