;app.ScrollBar = function (chart, buttons, cb) {
  var Elem = app.E,
    offsetTB = 3,
    sideWidth = 14,
    width = 400,
    height = 50,
    moveHandler = empty,
    totalDays = 1,
    view, diagram, frame, sides, sideLeft, sideRight, self, anchorsX = [], anchorsMap = [];

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

  function updateAnchors(dat, checkCb) {
    anchorsX.length = 0;
    anchorsMap.length = 0;
    anchorsX.push(0);
    anchorsMap.push(0);

    var colX = dat.columns[0], i, l;

    for (i = 2, l = colX.length - 1; i < l; i++) {
      if (checkCb(new Date(colX[i]))) {
        anchorsX.push((i - 1) / (l - 2) * width);
        anchorsMap.push(i - 1);
      }
    }

    anchorsX.push(width);
    anchorsMap.push(l - 1);
  }

  sideLeft = sides[0];
  sideRight = sides[1];

  self = {
    view: view,
    leftIndex: 0,
    rightIndex: 0,
    diagram: diagram,
    setRange: setRange,

    setOver: function (overview) {
      totalDays = overview.columns[0].length - 2;
      diagram.setOver(overview);

      updateAnchors(overview, function (date) {
        return date.getUTCDate() === 1;
      });
    },

    setDat: function (dat) {
      totalDays = dat.columns[0].length - 2;
      diagram.setDat(dat);

      updateAnchors(dat, function (date) {
        return date.getUTCHours() === 0;
      });
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

  function getIndex(x, offset) {
    var i = 0, l = anchorsX.length, d, index = 0;
    var minDist = Number.MAX_VALUE;

    for (; i < l; i++) {
      d = Math.abs(anchorsX[i] - x);

      if (d < minDist) {
        minDist = d;
        index = i;
      }
    }

    return anchorsMap[index];
  }

  function leftSideMove() {
    var newIndex = Math.max(0, getIndex(getLocalX(), 1));
    self.leftIndex !== newIndex && newIndex < self.rightIndex && setRange(newIndex, self.rightIndex);
  }

  function rightSideMove() {
    var newIndex = Math.min(totalDays, getIndex(getLocalX(), 0));
    self.rightIndex !== newIndex && newIndex > self.leftIndex && setRange(self.leftIndex, newIndex);
  }

  function frameMove() {
    var halfDif = (sideRight.x - (sideLeft.x + sideLeft.w)) / 2;
    var leftIndex = Math.max(0, Math.min(self.rightIndex, getIndex(getLocalX() - halfDif, 0)));
    var rightIndex = Math.max(self.leftIndex, Math.min(totalDays, getIndex(getLocalX() + halfDif, 0)));

    if (leftIndex !== self.leftIndex && rightIndex !== self.rightIndex) {
      setRange(leftIndex, rightIndex);
    }
  }

  function empty() {
  }

  return self;
};
