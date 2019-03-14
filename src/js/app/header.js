import {Graph, Tween} from '../engine';
import config from './config';

export default class Header extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    const gradientCanvas = document.createElement('canvas');

    {
      gradientCanvas.width = 10;
      gradientCanvas.height = 20;
      const ctx = gradientCanvas.getContext('2d');
      const grd = ctx.createLinearGradient(0, 0, 0, 14);
      grd.addColorStop(0, 'rgba(0,0,0,0.1)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
    }

    this.titleColor = {r: 0, g: 0, b: 0};
    this.height = gradientCanvas.height;
    this.gradientCanvas = gradientCanvas;
    this.titleColorTween = new Tween(engine, this.titleColor);
  }

  handleResize(width, height) {
    super.handleResize(width, height);
    this.width = width;
  }

  handleModeChange(mode, time = 0.3) {
    this.titleColorTween.set(config[mode].titleColor, time).start();
  }

  render(ctx) {
    const {global, titleColor, engine} = this;
    const style = config.titleTextStyle;

    ctx.drawImage(this.gradientCanvas, 0, 0, global.width, global.height);

    ctx.font = `${style.weight} ${style.size}px ${style.family}`;
    ctx.fillStyle = `rgb(${titleColor.r},${titleColor.g},${titleColor.b})`;
    ctx.textAlign = 'center';
    ctx.fillText(config.title, global.width * 0.5, engine.view.height * 0.5 - LP(268, 360));
  }
}
