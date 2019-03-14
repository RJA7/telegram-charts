import {Graph} from '../../../engine';

export default class FrameSide extends Graph {
  constructor(engine, parent, side) {
    super(engine, parent);

    this.color = null;
    this.side = side;
    engine.input.add(this);
  }

  contains(inputX, inputY) {
    let {global: {x, y, width, height}, side} = this;
    width += 20;
    x += side === -1 ? -20 : 0;

    return inputX > x && inputX < x + width && inputY > y && inputY < y + height;
  }

  render(ctx) {
    const {global, color} = this;
    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    ctx.fillRect(global.x, global.y, global.width, global.height);
  }
}
