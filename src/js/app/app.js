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
    const {bg, modeText, tapAnim, chart, header, mode: m} = this;
    const mode = m === config.mode.DAY ? config.mode.NIGHT : config.mode.DAY;
    this.mode = mode;
    bg.handleModeChange(mode, time);
    modeText.handleModeChange(mode, time);
    tapAnim.handleModeChange(mode, time);
    chart.handleModeChange(mode, time);
    header.handleModeChange(mode, time);
  }

  handleBgInputMove() {
    if (this.isChartTween) return;

    const {chart, engine} = this;
    chart.x += engine.input.dx;
    chart.alpha = Math.max(0, 1 - Math.abs(engine.view.width / 2 - chart.x) / 100);
    chart.alpha === 0 && this.changeData(engine.input.dx > 0 ? -1 : 1);
  }

  handleBgInputUp() {
    if (this.chart.alpha === 1) return;
    this.chartTween.set({x: this.engine.view.width / 2, alpha: 1}, 0.2, Tween.sin.out).start();
  }

  changeData(sign) {
    const {chart, engine, chartTween, mode} = this;
    this.dataIndex = (this.dataIndex + chartData.length + sign) % chartData.length;
    chart.setData(chartData[this.dataIndex], mode);

    const centerX = engine.view.width / 2;
    chart.x = centerX + sign * 400;
    chartTween.set({x: centerX, alpha: 1}, 0.2, Tween.sin.out).start();
    this.isChartTween = true;
  }

  handleResize(width, height) {
    const {chart, modeText, chartTween} = this;
    chart.y = height / 2 + LP(60, 20);

    if (chartTween.ticksLeft > 0) {
      chartTween.dst.x = width / 2;
    } else {
      chart.x = width / 2;
    }

    super.handleResize(width, height);
    modeText.x = LP(chart.nameText.x + width / 2, width / 2 - modeText.width / 2);
    modeText.y = LP(chart.y + 270, height - 16);
  }

  update() {
    if (this.chartTween.ticksLeft <= 0 && this.engine.input.isUp) {
      this.isChartTween = false;
    }
  }
}

new App(new Engine());
