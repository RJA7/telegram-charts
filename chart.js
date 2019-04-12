;app.Chart = function (contest, chartIndex) {
  var Elem = app.E,
    input = app.i,
    overview = contest.overview,
    data = contest.data,
    leftIndex = 0,
    isSingle = chartIndex === 3,
    rightIndex = Math.min(90, overview.columns[0].length - 2),
    body = document.body,
    index, view, diagram, axisX, buttons, header, scrollBar, info, hLines, isOverMode;

  var chart = {
    getInputX: function getInputX() {
      return (input.x - view.e.offsetLeft) / view.sc + app.getScrollX();
    },

    getInputY: function () {
      return (input.y - view.e.offsetTop) / view.sc + app.getscrollY();
    }
  };

  view = new Elem('div');
  body.appendChild(view.e);
  view.sW(400);
  view.sH(540);
  view.sC('chart');

  header = app.Header(view, onOverMode);
  buttons = app.Buttons(view, isSingle, onButtonClick);

  hLines = new app.HLines(overview.y_scaled ? 2 : 1);

  diagram = app.Diagram(400, 250, buttons, hLines, true);
  diagram.view.sX(0);
  diagram.view.sY(80);
  view.add(diagram.view);

  axisX = app.AxisX(diagram.view);

  scrollBar = app.ScrollBar(chart, buttons, isSingle, onRangeChange);
  view.add(scrollBar.view);

  info = app.Info(chart, diagram, scrollBar, buttons, isSingle, onDatMode);

  onDayMode();
  onOverMode();

  function onButtonClick() {
    scrollBar.renderDiagram();
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX);
  }

  function onRangeChange() {
    header.setRange(scrollBar.leftIndex, scrollBar.rightIndex);
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX);
  }

  function onDayMode() {
    diagram.bgColor = '#ffffff';
    scrollBar.diagram.bgColor = '#ffffff'; // 'rgba(226,238,249,0.6)';
  }

  function onOverMode() {
    isOverMode = true;
    header.setOver(overview);
    buttons.setOver(data[0]);
    scrollBar.setOver(overview);
    diagram.setOver(overview);
    axisX.setOver(overview);
    hLines.setOver(overview);
    info.setOver(overview);
    scrollBar.setRange(leftIndex, rightIndex);
    scrollBar.renderDiagram();
  }

  function onDatMode(i) {
    if (!isOverMode) return;
    isOverMode = false;

    var dat = data[i];
    leftIndex = scrollBar.leftIndex;
    rightIndex = scrollBar.rightIndex;
    index = i;

    header.setDat(dat);
    buttons.setDat(dat);
    scrollBar.setDat(dat);
    scrollBar.setDat(dat);
    diagram.setDat(dat);
    axisX.setDat(dat);
    hLines.setDat(dat);
    info.setDat(dat);
    scrollBar.setRange(0, Math.min(36, dat.columns[0].length - 2));
    scrollBar.renderDiagram();
  }

  return {
    view: view,

    update: function () {

    }
  };
};
