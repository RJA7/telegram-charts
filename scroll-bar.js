;app.ScrollBar = function (chart, buttons, cb) {
  var Elem = app.E,
    offsetTB = 5,
    sideWidth = 20,
    width = 400,
    height = 50,
    moveHandler = empty,
    totalDays = 1,
    view, diagram, frame, sides, sideLeft, sideRight, self;

  view = new Elem('div');
  view.sY(370);
  view.sW(width);
  view.sH(height);

  diagram = app.Diagram(width, height, buttons);
  view.add(diagram.view);

  frame = new Elem('div');
  frame.sY(-offsetTB);
  frame.sH(height);
  frame.sC('frame');
  view.add(frame);
  frame.onDown(function () {
    moveHandler = frameMove;
  });

  sides = [leftSideMove, rightSideMove].map(function (handler) {
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

  sideLeft = sides[0];
  sideRight = sides[1];

  self = {
    view: view,
    leftIndex: 0,
    rightIndex: 0,
    setRange: setRange,

    setOver: function (overview) {
      totalDays = overview.columns[0].length - 2;
      diagram.setOver(overview);
    },

    setDat: function (dat) {
      totalDays = dat.columns[0].length - 2;
      diagram.setDat(dat);
    },

    renderDiagram: function render() {
      diagram.render(0, totalDays);
    }
  };

  app.i.moveHandlers.push(function () {
    moveHandler();
  });

  app.i.upHandlers.push(function () {
    moveHandler = empty;
  });

  function setRange(leftIndex, rightIndex) {
    self.leftIndex = leftIndex;
    self.rightIndex = rightIndex;
    sideLeft.sX(leftIndex / totalDays * width - sideWidth);
    sideRight.sX(rightIndex / totalDays * width);
    frame.sX(sideLeft.x - 5 + sideWidth);
    frame.sW(sideRight.x - sideLeft.x - sideWidth);

    cb(leftIndex, rightIndex);
  }

  function getLocalX() {
    return chart.getInputX() - view.x;
  }

  function getIndex(x) {
    return Math.round(x / width * totalDays);
  }

  function leftSideMove() {
    var newIndex = Math.max(0, Math.min(self.rightIndex - 1, getIndex(getLocalX())));
    self.leftIndex !== newIndex && setRange(newIndex, self.rightIndex);
  }

  function rightSideMove() {
    var newIndex = Math.max(self.leftIndex + 1, Math.min(totalDays, getIndex(getLocalX())));
    self.rightIndex !== newIndex && setRange(self.leftIndex, newIndex);
  }

  function frameMove() {
    var halfDif = (sideRight.x - (sideLeft.x + sideLeft.w)) / 2;
    var leftIndex = Math.max(0, Math.min(self.rightIndex, getIndex(getLocalX() - halfDif)));
    var rightIndex = Math.max(self.leftIndex, Math.min(totalDays, getIndex(getLocalX() + halfDif)));

    if (leftIndex !== self.leftIndex && rightIndex !== self.rightIndex) {
      setRange(leftIndex, rightIndex);
    }
  }

  function empty() {
  }

  return self;
};
