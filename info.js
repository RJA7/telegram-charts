;app.Info = function (chart, diagram, scrollBar, cb) {
  var index = 0;
  var view = new app.E('div');
  view.sW(diagram.canvas.width);
  view.sH(diagram.canvas.height);
  view.sO(0);
  view.sY(0);
  diagram.view.add(view);

  var line = new app.E('div');
  line.sW(2);
  line.sY(20);
  line.sH(view.h - 18);
  line.sC('info-line');
  view.add(line);

  var bg = new app.E('div');
  bg.sC('info-bg');
  bg.sY(0);
  bg.sW(140);
  bg.sH(60);
  bg.onDown(onBgClick);
  view.add(bg);

  diagram.view.onDown(function () {
    view.sO(1);
  });

  app.i.downHandlers.push(function () {
    var localY = chart.getInputY() - diagram.view.y;
    if (localY < 0 || localY > diagram.canvas.height) {
      view.sO(0);
    }
  });

  app.i.moveHandlers.push(function onMouseMove() {
    var localY = chart.getInputY() - diagram.view.y;

    if (localY < 0 || localY > diagram.canvas.height) return;

    var localX = chart.getInputX() - diagram.view.x;
    localX = Math.max(0, Math.min(view.w, localX));

    var len = scrollBar.sideRight.index - scrollBar.sideLeft.index;
    var step = view.w / len;

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
};
