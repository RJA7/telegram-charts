import {Graph, Tween} from '../engine';
import config from './config';

export default class Tutorial extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.bakeText('Swipe Left or Right to\nnavigate between charts data',
      {size: 36, fill: '#ffffff', align: 'center', lineWidth: 1, stroke: '#000000'});

    this.alpha = 1;

    engine.input.add(this);
    this.onInputDown.addOnce(this.destroy, this);
  }

  contains(inputX, inputY) {
    return true;
  }

  destroy() {
    this.engine.input.remove(this);

    new Tween(this.engine, this)
      .set({alpha: 0}, 0.3)
      .start()
      .onComplete.add(super.destroy, this);
  }

  render(ctx) {
    const {engine: {view: {width, height}}, cache: {canvas}} = this;
    const {boxFill, boxStroke} = config[config.mode.NIGHT].info;

    ctx.globalAlpha = this.alpha;

    ctx.fillStyle = 'rgba(50,50,50,0.5)';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const hw = canvas.width / 2;
    const hh = canvas.height / 2;
    const offset = 40;
    const radius = 20;
    const left = centerX - hw - offset;
    const right = centerX + hw + offset;
    const top = centerY - hh - offset;
    const bottom = centerY + hh + offset;

    ctx.beginPath();
    ctx.moveTo(left + radius, top);
    ctx.arcTo(right, top, right, bottom, radius);
    ctx.arcTo(right, bottom, left, bottom, radius);
    ctx.arcTo(left, bottom, left, top, radius);
    ctx.arcTo(left, top, right, top, radius);

    ctx.fillStyle = `rgba(${boxFill.r},${boxFill.g},${boxFill.b})`;
    ctx.shadowColor = `rgba(${boxStroke.r},${boxStroke.g},${boxStroke.b},${boxStroke.a})`;
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.drawImage(canvas, centerX - hw, centerY - hh);

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
