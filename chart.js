;app.Chart = function (contest) {
  var Elem = app.E,
    input = app.i,
    overview = contest.overview,
    data = contest.data,
    leftIndex = 0,
    rightIndex = overview.columns[0].length - 2,
    body = document.body,
    index, view, diagram, axisX, axesY, buttons, header, scrollBar, info, hLines;

  var chart = {
    getInputX: function getInputX() {
      return input.x - view.e.offsetLeft + app.getScrollX();
    },

    getInputY: function () {
      return input.y - view.e.offsetTop + app.getscrollY();
    }
  };

  view = new Elem('div');
  body.appendChild(view.e);
  view.sW(400);
  view.sH(540);

  header = app.Header(view, onOverMode);
  buttons = app.Buttons(view, onButtonClick);

  hLines = new app.HLines();

  diagram = app.Diagram(400, 250, buttons, hLines);
  diagram.view.sX(0);
  diagram.view.sY(80);
  view.add(diagram.view);

  axisX = app.AxisX(diagram.view);
  axesY = [app.AxisY(diagram.view)];
  overview.y_scaled && axesY.push(app.AxisY(diagram.view, true));

  scrollBar = app.ScrollBar(chart, buttons, onRangeChange);
  view.add(scrollBar.view);

  info = app.Info(chart, diagram, scrollBar, onDatMode);

  onDayMode();
  onOverMode();

  function onButtonClick() {
    scrollBar.renderDiagram();
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX, axesY);
  }

  function onRangeChange() {
    header.setRange(scrollBar.leftIndex, scrollBar.rightIndex);
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX, axesY);
  }

  function onDayMode() {
    diagram.bgColor = '#ffffff';
    scrollBar.diagram.bgColor = 'rgba(226,238,249,0.6)';
  }

  function onOverMode() {
    header.setOver(overview);
    buttons.setOver(overview);
    scrollBar.setOver(overview);
    diagram.setOver(overview);
    axisX.setOver(overview);
    scrollBar.setRange(leftIndex, rightIndex);
    scrollBar.renderDiagram();
  }

  function onDatMode(i) {
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
    scrollBar.setRange(0, dat.columns[0].length - 2);
    scrollBar.renderDiagram();
  }

  return view;
};

app.supportPageOffset = window.pageXOffset !== undefined;
app.isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');

app.getScrollX = app.supportPageOffset ? function () {
  return window.pageXOffset;
} : app.isCSS1Compat ? function () {
  return document.documentElement.scrollLeft;
} : function () {
  return document.body.scrollLeft;
};

app.getscrollY = app.supportPageOffset ? function () {
  return window.pageYOffset;
} : app.isCSS1Compat ? function () {
  return document.documentElement.scrollTop;
} : function () {
  return document.body.scrollTop;
};
