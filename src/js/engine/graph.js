import Signal from './signal';

const measureCanvas = document.createElement('canvas');
const measureCtx = measureCanvas.getContext('2d');

export default class Graph {
  constructor(engine, parent) {
    parent && parent.children.push(this);

    this.engine = engine;
    this.parent = parent;
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.anchorX = 0;
    this.anchorY = 0;
    this.width = 1;
    this.height = 1;
    this.children = [];
    this.global = {x: 0, y: 0, scaleX: 1, scaleY: 1, width: 1, height: 1};
    this.cache = {canvas: null, ctx: null};
    this.stopGlobalInput = false;

    this.onInputDown = new Signal();
    this.onInputUp = new Signal();
    this.onInputMove = new Signal();
  }

  handleResize(width, height) {
    const {children} = this;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].handleResize(width, height);
    }
  }

  contains(inputX, inputY) {
    const {global: {x, y, width, height}} = this;
    return x < inputX && x + width > inputX && y < inputY && y + height > inputY;
  }

  bakeText(text, style) {
    if (!this.cache.canvas) {
      this.cache.canvas = document.createElement('canvas');
      this.cache.ctx = this.cache.canvas.getContext('2d');
    }

    const {size = 24, family = 'Arial', fill = '', stroke = '', lineWidth = 0, lineSpacing = 1.5} = style;
    const {cache: {canvas, ctx}} = this;
    const halfStroke = lineWidth / 2;

    const lines = text.split('\n');
    this.width = 0;

    for (let i = 0, l = lines.length; i < l; i++) {
      this.width = Math.max(this.width, this.measureText(text, style, this).width);
    }

    const lineHeight = this.height;
    canvas.width = this.width;
    canvas.height = this.height = lineHeight * lines.length + lineSpacing * lineHeight * (lines.length - 1);

    ctx.font = `${size}px ${family}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    if (fill !== '') {
      ctx.fillStyle = fill;
    }

    if (lineWidth > 0) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
    }

    for (let i = 0, l = lines.length, offset = lineHeight * lineSpacing; i < l; i++) {
      if (fill !== '') {
        ctx.fillText(lines[i], halfStroke, halfStroke + offset * i);
      }

      if (lineWidth > 0) {
        ctx.strokeText(lines[i], halfStroke, halfStroke + offset * i);
      }
    }
  }

  measureText(text, style, out = {width: 0, height: 0}) {
    const {size = 24, family = 'Arial', lineWidth = 0} = style;
    measureCtx.font = `${size}px ${family}`;

    out.width = measureCtx.measureText(text).width + lineWidth;
    out.height = size + lineWidth;

    return out;
  }

  clampX(min, max) {
    this.x = Math.max(min, Math.min(max, this.x));
  }

  destroy() {
    const {engine: {input: {graphs}}, parent: {children}, parent, onInputDown, onInputUp, onInputMove} = this;

    if (parent) {
      const index = children.indexOf(this);
      index !== -1 && children.splice(index, 1);
    }

    const index = graphs.indexOf(this);
    index !== -1 && graphs.splice(index, 1);

    onInputDown.removeAll();
    onInputUp.removeAll();
    onInputMove.removeAll();

    this.engine = null;
    this.parent = null;
    this.global = null;
    this.cache = null;
  }

  _update() {
    const {children} = this;
    this.update();

    for (let i = 0, l = children.length; i < l; i++) {
      children[i]._update();
    }
  }

  _render(ctx, x, y, scaleX, scaleY) {
    const {children, global} = this;

    global.scaleX = scaleX * this.scaleX;
    global.scaleY = scaleY * this.scaleY;
    global.width = this.width * global.scaleX;
    global.height = this.height * global.scaleY;
    global.x = x + this.x * scaleX - global.width * this.anchorX;
    global.y = y + this.y * scaleY - global.height * this.anchorY;

    this.render(ctx);

    for (let i = 0, l = children.length; i < l; i++) {
      children[i]._render(ctx, global.x, global.y, global.scaleX, global.scaleY);
    }
  }

  update() {

  }

  render(ctx) {

  }
}
