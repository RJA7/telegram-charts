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
    this.axisX.handleModeChange(mode, time);
    this.axisY.handleModeChange(mode, time);
    this.scrollBar.handleModeChange(mode, time);
    this.nameText.handleModeChange(mode, time);
    this.info.handleModeChange(mode);
    this.buttons.forEach(button => button.handleModeChange(mode, time));
  }

  handleButtonClick(button) {
    button.toggleActive();
    this.diagram.setColVisibility(button.colId, button.isActive);
    this.scrollBar.diagram.setColVisibility(button.colId, button.isActive);

    if (button !== this.topButton) {
      const index = this.children.indexOf(button);
      this.children.splice(this.children.indexOf(this.topButton), 1, button);
      this.children.splice(index, 1, this.topButton);
      this.topButton = button;
    }
  }

  handleResize(width, height) {
    super.handleResize(width, height);

    const offset = LP(20, 10);
    let totalWidth = 0;
    let totalHeight = 0;
    let maxBtnWidth = 0;

    for (let i = 0, l = this.buttons.length; i < l; i++) {
      totalWidth += this.buttons[i].width + offset;
      totalHeight += this.buttons[i].height + offset;
      maxBtnWidth = Math.max(maxBtnWidth, this.buttons[i].width);
    }


    if (LP(true, false)) {
      this.nameText.x = (this.width - maxBtnWidth) / 2 + 26;
      this.nameText.y = -totalHeight / 2 - 74;

      for (let i = 0, l = this.buttons.length, prevBottom = this.nameText.y + 14; i < l; i++) {
        this.buttons[i].x = this.nameText.x - 6;
        this.buttons[i].y = prevBottom + offset;
        prevBottom = this.buttons[i].y + this.buttons[i].height;
      }
    } else {
      this.nameText.x = -this.nameText.width / 2;
      this.nameText.y = -340;

      for (let i = 0, l = this.buttons.length, prevRight = -totalWidth * 0.5 - 4; i < l; i++) {
        this.buttons[i].x = prevRight + offset;
        this.buttons[i].y = 300;
        prevRight = this.buttons[i].x + this.buttons[i].width;
      }
    }

    this.diagram.x = -this.width / 2 + LP(-maxBtnWidth / 2 - 20, 0);
    this.diagram.y = 120;
    this.diagram.width = this.width;
    this.diagram.height = -LP(390, 400);

    this.scrollBar.x = this.diagram.x + this.width / 2;
    this.scrollBar.y = LP(162, 180);
    this.scrollBar.width = this.width;
    this.scrollBar.height = 90;

    this.axisY.width = this.width * this.scaleX;
  }

  setData(data, mode) {
    this.scrollBar.setData(data);
    this.diagram.setData(data);
    this.nameText.setData(data);
    this.axisX.reset();
    this.axisY.reset();

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
    this.handleResize(this.engine.view.width, this.engine.view.height);
  }

  _render(ctx, x, y, scaleX, scaleY) {
    ctx.globalAlpha = this.alpha;
    super._render(ctx, x, y, scaleX, scaleY);

    if (this.alpha !== 1) {
      ctx.globalAlpha = 1;
    }
  }
}
