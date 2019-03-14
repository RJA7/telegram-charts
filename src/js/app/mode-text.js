import {Graph} from '../engine';
import config from './config';

export default class ModeText extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    this.anchorY = 1;
    this.stopGlobalInput = true;
    this.mode = config.mode.DAY;

    engine.input.add(this);
  }

  handleModeChange(mode) {
    this.mode = mode;
    this.bakeText(this.getText(mode), config.modeTextStyle);
  }

  handleResize(width, height) {
    this.bakeText(this.getText(this.mode), config.modeTextStyle);
  }

  getText(mode) {
    return mode === config.mode.DAY ? `Switch to${LP('\n', ' ')}Night Mode` : `Switch to${LP('\n', ' ')}Day Mode`;
  }

  render(ctx) {
    const {global} = this;
    ctx.drawImage(this.cache.canvas, global.x, global.y, global.width, global.height);
  }
}
