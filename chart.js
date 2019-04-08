;app.Chart = function (data, datas) {
  var Elem = app.E;
  var input = app.i;
  var first, last, index;

  var chart = {
    getInputX: function getInputX() {
      return input.x - view.x;
    },

    getInputY: function () {
      return input.y - view.y;
    }
  };

  var view = new Elem('div');
  view.sX(40);
  document.body.appendChild(view.e);

  var diagram = app.Diagram(400, 250);
  diagram.setData(data);
  diagram.view.sY(80);
  view.add(diagram.view);

  var axisX = app.AxisX(diagram.view);
  axisX.setStandardData(data);

  var axesY = [app.AxisY(diagram.view, true)];
  data.y_scaled && axesY.push(app.AxisY(diagram.view, false));
  var buttons = app.Buttons(data, view, onButtonClick);

  var header = app.Header(view, onStandardMode);

  var scrollBar = app.ScrollBar(chart, buttons, onRangeChange);
  scrollBar.setData(data);
  scrollBar.setRange(0, data.columns[0].length - 2);
  scrollBar.renderDiagram();
  view.add(scrollBar.view);

  var info = app.Info(chart, diagram, scrollBar, onCloseMode);

  function onButtonClick() {
    onRangeChange();
    scrollBar.renderDiagram();
  }

  function onRangeChange() {
    diagram.render(scrollBar.sideLeft.index, scrollBar.sideRight.index, buttons, axisX, axesY);
    header.setRange(scrollBar.sideLeft.index, scrollBar.sideRight.index, data, datas[index]);
  }

  function onStandardMode() {
    axisX.setStandardData(data);
    diagram.setData(data);
    scrollBar.setData(data);
    scrollBar.setRange(first, last);
    scrollBar.renderDiagram();
    header.standardMode();
  }

  function onCloseMode(i) {
    index = i;
    first = scrollBar.sideLeft.index;
    last = scrollBar.sideRight.index;

    axisX.setCloseData(datas[i]);
    diagram.setData(datas[i]);
    scrollBar.setData(datas[i]);
    scrollBar.renderDiagram();
    header.closeMode();
  }
};
