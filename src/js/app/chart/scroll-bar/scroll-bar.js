import {Graph, Signal, Tween} from '../../../engine';
import FrameSide from './frame-side';
import Frame from './frame';
import Overlay from './overlay';
import Diagram from '../diagram';
import config from '../../config';

export default class ScrollBar extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    const frameColor = {r: 0, g: 0, b: 0, a: 0};
    const overlayColor = {r: 0, g: 0, b: 0, a: 0};
    const bgColor = {r: 0, g: 0, b: 0};

    const diagram = new Diagram(engine, this);

    const frameLeft = new FrameSide(engine, this, -1);
    frameLeft.anchorX = 1;
    frameLeft.anchorY = 0.5;
    frameLeft.color = frameColor;

    const frameRight = new FrameSide(engine, this, 1);
    frameRight.anchorX = 0;
    frameRight.anchorY = 0.5;
    frameRight.color = frameColor;

    const frame = new Frame(engine, this);
    frame.anchorX = 0.5;
    frame.anchorY = 0.5;
    frame.color = frameColor;

    const overlayLeft = new Overlay(engine, this);
    overlayLeft.color = overlayColor;

    const overlayRight = new Overlay(engine, this);
    overlayRight.anchorX = 1;
    overlayRight.color = overlayColor;

    frameLeft.onInputMove.add(this.handleFrameLeftMove, this);
    frameRight.onInputMove.add(this.handleFrameRightMove, this);
    frame.onInputMove.add(this.handleFrameMove, this);
    overlayLeft.onInputMove.add(this.handleFrameLeftMove, this);
    overlayRight.onInputMove.add(this.handleFrameRightMove, this);

    this.frameLeft = frameLeft;
    this.frameRight = frameRight;
    this.frame = frame;
    this.diagram = diagram;
    this.overlayLeft = overlayLeft;
    this.overlayRight = overlayRight;
    this.bgColor = bgColor;
    this.frameColorTween = new Tween(engine, frameColor);
    this.overlayColorTween = new Tween(engine, overlayColor);
    this.bgColorTween = new Tween(engine, bgColor);
    this.onCropChange = new Signal();
  }

  setData(data) {
    const {diagram, frameLeft, frameRight, frame, overlayLeft, overlayRight, width, height} = this;

    diagram.x = -width / 2;
    diagram.y = height - 10;
    diagram.width = width;
    diagram.height = -(height - 30);
    diagram.setData(data);

    frameLeft.x = -width / 2;
    frameLeft.y = height / 2;
    frameLeft.width = 20;
    frameLeft.height = height;

    frameRight.x = width / 2;
    frameRight.y = height / 2;
    frameRight.width = 20;
    frameRight.height = height;

    frame.y = height / 2;
    frame.height = height;

    overlayLeft.x = -width / 2 - 1;
    overlayLeft.height = height;
    overlayRight.x = width / 2 + 1;
    overlayRight.height = height;

    this.syncFrame(true);
  }

  handleModeChange(mode, time = 0.3) {
    const {frameColorTween, overlayColorTween, bgColorTween} = this;
    const {frame, overlay, bg} = config[mode].scrollBar;
    frameColorTween.set(frame, time).start();
    overlayColorTween.set(overlay, time).start();
    bgColorTween.set(bg, time).start();
  }

  handleFrameLeftMove() {
    const {frameLeft, frameRight, engine, width} = this;

    if (!engine.input.isDown) return;

    frameLeft.x += engine.input.dx;
    frameLeft.clampX(-width / 2, frameRight.x - 3);

    this.syncFrame();
  }

  handleFrameRightMove() {
    const {frameLeft, frameRight, engine, width} = this;

    if (!engine.input.isDown) return;

    frameRight.x += engine.input.dx;
    frameRight.clampX(frameLeft.x + 3, width / 2);

    this.syncFrame();
  }

  handleFrameMove() {
    const {frameLeft, frameRight, frame, engine, width} = this;

    if (!engine.input.isDown) return;

    frame.x += engine.input.dx;
    frame.clampX((frame.width - width) / 2, -(frame.width - width) / 2);
    frameLeft.x = frame.x - frame.width / 2;
    frameRight.x = frame.x + frame.width / 2;

    this.syncFrame();
  }

  syncFrame(silent = false) {
    const {frameLeft, frameRight, frame, overlayLeft, overlayRight, width, onCropChange} = this;

    frame.x = (frameLeft.x + frameRight.x) / 2;
    frame.width = frameRight.x - frameLeft.x;
    overlayLeft.width = Math.max(0, frameLeft.x - overlayLeft.x - frameLeft.width);
    overlayRight.width = Math.max(0, overlayRight.x - frameRight.x - frameRight.width);

    !silent && onCropChange.dispatch(0.5 + frameLeft.x / width, 0.5 + frameRight.x / width);
  }

  render(ctx) {
    const {global, bgColor, width} = this;
    ctx.fillStyle = `rgb(${bgColor.r},${bgColor.g},${bgColor.b})`;
    ctx.fillRect(global.x - width / 2, global.y, global.width, global.height);
  }
}
