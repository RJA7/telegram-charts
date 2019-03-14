import {Graph} from '../../../engine';

export default class Frame extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.color = null;
    engine.input.add(this);
  }

  render(ctx) {
    const {global: {x, y, width, height}, color} = this;

    ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
    ctx.fillRect(x, y, width, 4);
    ctx.fillRect(x, y + height - 4, width, 4);
  }
}
