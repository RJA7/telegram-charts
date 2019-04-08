;app.ScrollBar = function (chart, buttons, cb) {
  var Elem = app.E;
  var offsetTB = 5;
  var sideWidth = 20;
  var width = 400;
  var height = 50;
  var moveHandler = empty;
  var totalDays;

  var view = new Elem('div');
  view.sY(370);
  view.sW(width);
  view.sH(height);

  var diagram = app.Diagram(width, height);
  view.add(diagram.view);

  var frame = new Elem('div');
  frame.sY(-offsetTB);
  frame.sH(height);
  frame.sC('frame');
  view.add(frame);
  frame.onDown(function () {
    moveHandler = frameMove;
  });

  var sides = [leftSideMove, rightSideMove].map(function (handler) {
    var side = new Elem('div');
    side.sY(-offsetTB);
    side.sW(sideWidth);
    side.sH(view.gH() + offsetTB * 2);
    side.sC('side-day');
    view.add(side);
    side.onDown(function () {
      moveHandler = handler;
    });

    return side;
  });

  var sideLeft = sides[0];
  var sideRight = sides[1];

  function setRange(firstDayIndex, lastDayIndex) {
    sideLeft.index = firstDayIndex;
    sideRight.index = lastDayIndex;
    sideLeft.sX(firstDayIndex / totalDays * width - sideWidth);
    sideRight.sX(lastDayIndex / totalDays * width);
    frame.sX(sideLeft.x - 5 + sideWidth);
    frame.sW(sideRight.x - sideLeft.x - sideWidth);

    cb(firstDayIndex, lastDayIndex);
  }

  function getLocalX() {
    return chart.getInputX() - view.x;
  }

  function getIndex(x) {
    return Math.round(x / width * totalDays);
  }

  function leftSideMove() {
    var newIndex = Math.max(0, Math.min(sideRight.index - 1, getIndex(getLocalX())));
    sideLeft.index !== newIndex && setRange(newIndex, sideRight.index);
  }

  function rightSideMove() {
    var newIndex = Math.max(sideLeft.index + 1, Math.min(totalDays, getIndex(getLocalX())));
    sideRight.index !== newIndex && setRange(sideLeft.index, newIndex);
  }

  function frameMove() {
    var halfDif = (sideRight.x - (sideLeft.x + sideLeft.w)) / 2;
    var leftIndex = Math.max(0, Math.min(sideRight.index, getIndex(getLocalX() - halfDif)));
    var rightIndex = Math.max(sideLeft.index, Math.min(totalDays, getIndex(getLocalX() + halfDif)));

    if (leftIndex !== sideLeft.index && rightIndex !== sideRight.index) {
      setRange(leftIndex, rightIndex);
    }
  }

  app.i.moveHandlers.push(function () {
    moveHandler();
  });

  app.i.upHandlers.push(function () {
    moveHandler = empty;
  });

  function empty() {
  }

  return {
    view: view,
    sideLeft: sideLeft,
    sideRight: sideRight,
    setRange: setRange,
    setData: function (data) {
      totalDays = data.columns[0].length - 2;
      diagram.setData(data);
      setRange(0, totalDays);
    },
    renderDiagram: function render() {
      diagram.render(0, totalDays, buttons);
    }
  }
};
