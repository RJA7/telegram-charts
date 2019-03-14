import Engine, {Graph, Tween} from '../engine';
import config from './config';
import Bg from './bg';
import ModeText from './mode-text';
import chartData from '../../chart_data';
import Chart from './chart/chart';
import TapAnim from './tap-anim';
import Header from './header';

chartData.forEach((data, i) => data.name = `Chart #${i + 1}`);

class App extends Graph {
  constructor(engine) {
    super(engine, engine.stage);

    const bg = new Bg(engine, this);
    const modeText = new ModeText(engine, this);
    const chart = new Chart(engine, this);
    const tapAnim = new TapAnim(engine, this);
    const header = new Header(engine, this);

    this.bg = bg;
    this.modeText = modeText;
    this.tapAnim = tapAnim;
    this.chart = chart;
    this.header = header;
    this.mode = config.mode.DAY;
    this.dataIndex = 0;
    this.isChartTween = null;
    this.chartTween = new Tween(engine, chart);

    modeText.onInputDown.add(this.handleModeTextClick, this);
    bg.onInputMove.add(this.handleBgInputMove, this);
    bg.onInputUp.add(this.handleBgInputUp, this);

    engine.handleResize();
    chart.setData(chartData[this.dataIndex], this.mode);
    this.handleModeTextClick(0);
    engine.handleResize();
  }

  handleModeTextClick(time) {
    this.mode = this.mode === config.mode.DAY ? config.mode.NIGHT : config.mode.DAY;
    this.bg.handleModeChange(this.mode, time);
    this.modeText.handleModeChange(this.mode, time);
    this.tapAnim.handleModeChange(this.mode, time);
    this.chart.handleModeChange(this.mode, time);
    this.header.handleModeChange(this.mode, time);
  }

  handleBgInputMove() {
    if (this.isChartTween) return;

    this.chart.x += this.engine.input.dx;
    this.chart.alpha = Math.max(0, 1 - Math.abs(this.engine.view.width / 2 - this.chart.x) / 100);
    this.chart.alpha === 0 && this.changeData(this.engine.input.dx > 0 ? -1 : 1);
  }

  handleBgInputUp() {
    if (this.chart.alpha === 1) return;
    this.chartTween.set({x: this.engine.view.width / 2, alpha: 1}, 0.2, Tween.sin.out).start();
  }

  changeData(sign) {
    this.dataIndex = (this.dataIndex + chartData.length + sign) % chartData.length;
    this.chart.setData(chartData[this.dataIndex], this.mode);

    const centerX = this.engine.view.width / 2;
    this.chart.x = centerX + sign * 400;
    this.isChartTween = true;
    this.chartTween.set({x: centerX, alpha: 1}, 0.2, Tween.sin.out).start();
  }

  handleResize(width, height) {
    this.chart.y = height / 2 + LP(60, 20);

    if (this.chartTween.ticksLeft > 0) {
      this.chartTween.dst.x = width / 2;
    } else {
      this.chart.x = width / 2;
    }

    super.handleResize(width, height);
    this.modeText.x = LP(this.chart.nameText.x + width / 2, width / 2 - this.modeText.width / 2);
    this.modeText.y = LP(this.chart.y + 270, height - 16);
  }

  update() {
    if (this.chartTween.ticksLeft <= 0 && this.engine.input.isUp) {
      this.isChartTween = false;
    }
  }
}

new App(new Engine());
