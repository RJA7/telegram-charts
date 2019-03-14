import {Graph} from '../../../engine';

export default class Overlay extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.color = null;
    engine.input.add(this);
  }

  render(ctx) {
    const {global, color} = this;
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    ctx.fillRect(global.x, global.y, global.width, global.height);
  }
}
