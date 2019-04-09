;app.Info = function (chart, diagram, scrollBar, cb) {
  var index = 0,
    bgInputEnabled = false,
    view, line, bg;

  view = new app.E('div');
  view.sW(diagram.canvas.width);
  view.sH(diagram.canvas.height);
  view.sO(0);
  view.sY(0);
  diagram.view.add(view);

  line = new app.E('div');
  line.sW(2);
  line.sY(20);
  line.sH(view.h - 18);
  line.sC('info-line');
  view.add(line);

  bg = new app.E('div');
  bg.sC('info-bg');
  bg.sY(0);
  bg.sW(140);
  bg.sH(60);
  bg.onDown(onBgClick);
  view.add(bg);

  diagram.view.onDown(function () {
    view.sO(1);
    bgInputEnabled = true;
  });

  app.i.downHandlers.push(function () {
    var localY = chart.getInputY() - diagram.view.y;

    if (localY < 0 || localY > diagram.canvas.height) {
      view.sO(0);
      bgInputEnabled = false;
    }
  });

  app.i.moveHandlers.push(function onMouseMove() {
    var localY = chart.getInputY() - diagram.view.y,
      localX = chart.getInputX() - diagram.view.x,
      len, step;

    if (localY < 0 || localY > diagram.canvas.height || localX < 0 || localX > view.w) return;

    len = scrollBar.rightIndex - scrollBar.leftIndex;
    step = view.w / len;

    index = Math.round(localX / step);
    localX = index * step;

    bg.sX(Math.max(0, Math.min(view.w - bg.w, localX - bg.w / 2)));
    line.sX(localX);
  });

  function onBgClick(e) {
    e.preventDefault();
    e.stopPropagation();

    cb(index);
  }

  return {
    setOver: function () {

    },

    setDat: function () {

    }
  }
};
