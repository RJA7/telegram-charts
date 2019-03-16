import {Graph} from '../../engine';
import ScrollBar from './scroll-bar/scroll-bar';
import Diagram from './diagram';
import Button from './button/button';
import AxisY from './axis-y';
import AxisX from './axis-x';
import NameText from './name-text';
import Info from './info';

export default class Chart extends Graph {
  constructor(engine, parent) {
    super(engine, parent);

    const scrollBar = new ScrollBar(engine, this);
    const diagram = new Diagram(engine, this);
    diagram.lineWidth = 3;
    engine.input.add(diagram);

    const axisX = new AxisX(engine, diagram);
    const axisY = new AxisY(engine, diagram);
    const info = new Info(engine, diagram, axisY);

    const nameText = new NameText(engine, this);

    scrollBar.onCropChange.add(this.handleCropChange, this);

    this.buttons = [];
    this.topButton = null;
    this.width = 580;
    this.scrollBar = scrollBar;
    this.diagram = diagram;
    this.axisX = axisX;
    this.axisY = axisY;
    this.alpha = 1;
    this.info = info;
    this.nameText = nameText;
  }

  handleCropChange(startPercentX, endPercentX) {
    this.diagram.setCrop(startPercentX, endPercentX);
  }

  handleModeChange(mode, time) {
    const {axisX, axisY, scrollBar, nameText, info, buttons} = this;
    axisX.handleModeChange(mode, time);
    axisY.handleModeChange(mode, time);
    scrollBar.handleModeChange(mode, time);
    nameText.handleModeChange(mode, time);
    info.handleModeChange(mode);
    buttons.forEach(button => button.handleModeChange(mode, time));
  }

  handleButtonClick(button) {
    const {diagram, scrollBar, topButton, children} = this;
    button.toggleActive();
    diagram.setColVisibility(button.colId, button.isActive);
    scrollBar.diagram.setColVisibility(button.colId, button.isActive);

    if (button !== topButton) {
      const index = children.indexOf(button);
      children.splice(children.indexOf(topButton), 1, button);
      children.splice(index, 1, topButton);
      this.topButton = button;
    }
  }

  handleResize(width, height) {
    super.handleResize(width, height);

    const {buttons, nameText, diagram, scrollBar, axisY, width: thisWidth} = this;

    const offset = LP(20, 10);
    let totalWidth = 0;
    let totalHeight = 0;
    let maxBtnWidth = 0;

    for (let i = 0, l = buttons.length; i < l; i++) {
      const button = buttons[i];
      totalWidth += button.width + offset;
      totalHeight += button.height + offset;
      maxBtnWidth = Math.max(maxBtnWidth, button.width);
    }


    if (LP(true, false)) {
      nameText.x = (thisWidth - maxBtnWidth) / 2 + 26;
      nameText.y = -totalHeight / 2 - 74;

      for (let i = 0, l = buttons.length, prevBottom = nameText.y + 14; i < l; i++) {
        const button = buttons[i];
        button.x = nameText.x - 6;
        button.y = prevBottom + offset;
        prevBottom = button.y + button.height;
      }
    } else {
      nameText.x = -nameText.width / 2;
      nameText.y = -340;

      for (let i = 0, l = buttons.length, prevRight = -totalWidth * 0.5 - 4; i < l; i++) {
        const button = buttons[i];
        button.x = prevRight + offset;
        button.y = 300;
        prevRight = button.x + button.width;
      }
    }

    diagram.x = -thisWidth / 2 + LP(-maxBtnWidth / 2 - 20, 0);
    diagram.y = 120;
    diagram.width = thisWidth;
    diagram.height = -LP(390, 400);

    scrollBar.x = diagram.x + thisWidth / 2;
    scrollBar.y = LP(162, 180);
    scrollBar.width = thisWidth;
    scrollBar.height = 90;

    axisY.width = thisWidth * this.scaleX;
  }

  setData(data, mode) {
    const {scrollBar, diagram, nameText, axisX, axisY} = this;
    scrollBar.setData(data);
    diagram.setData(data);
    nameText.setData(data);
    axisX.reset();
    axisY.reset();

    const {buttons, engine} = this;

    for (let i = 0, l = buttons.length; i < l; i++) {
      buttons[i].destroy();
    }

    buttons.length = 0;

    for (let i = 0, l = data.columns.length; i < l; i++) {
      const col = data.columns[i];
      if (col[0] === 'x') continue;

      const button = new Button(engine, this, data, col[0]);
      engine.input.add(button);
      button.handleModeChange(mode, 0);
      buttons.push(button);

      button.stopGlobalInput = true;
      button.onInputDown.add(this.handleButtonClick.bind(this, button));
    }

    this.topButton = buttons[buttons.length - 1];
    this.handleResize(engine.view.width, engine.view.height);
  }

  _render(ctx, x, y, scaleX, scaleY) {
    ctx.globalAlpha = this.alpha;
    super._render(ctx, x, y, scaleX, scaleY);

    if (this.alpha !== 1) {
      ctx.globalAlpha = 1;
    }
  }
}
