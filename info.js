;app.Info = function (chart, diagram, scrollBar, buttons, isBar, cb) {
  var index = 0,
    bgInputEnabled = false,
    nameEls = [],
    valueEls = [],
    view, line, bg, colX, cols,
    mainText,
    arrow,
    overlayLeft, overlayRight,
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut'],
    months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  view = new app.E('div');
  view.sC('tween');
  view.sW(diagram.view.w);
  view.sH(diagram.view.h);
  view.sO(0);
  view.sY(0);
  diagram.view.add(view);

  if (isBar) {
    overlayLeft = new app.E('div');
    overlayLeft.sH(diagram.view.h);
    overlayLeft.sC('info-overlay');
    diagram.overlayLayer.add(overlayLeft);

    overlayRight = new app.E('div');
    overlayRight.sH(diagram.view.h);
    overlayRight.e.style.right = 0 + 'px';
    overlayRight.sC('info-overlay');
    diagram.overlayLayer.add(overlayRight);
  } else {
    line = new app.E('div');
    line.sW(2);
    line.sY(0);
    line.sH(diagram.view.h);
    line.sC('info-line');
    view.add(line);
  }

  bg = new app.E('div');
  bg.sC('info-bg');
  bg.sW(160);
  bg.sH(60);
  bg.onDown(onBgClick);
  view.add(bg);

  mainText = new app.E('div');
  mainText.sC('info-main-text');
  mainText.sX(10);
  mainText.sY(4);
  bg.add(mainText);

  arrow = document.createElement('i');
  arrow.classList.add('arrow-right');
  arrow.style.left = 140 + 'px';
  arrow.style.top = 7 + 'px';
  arrow.style.position = 'absolute';
  bg.e.appendChild(arrow);

  for (var i = 0; i < 7; i++) {
    var nameEl = new app.E('div');
    bg.add(nameEl);
    nameEl.sC('info-name');
    nameEl.sX(10);
    nameEls.push(nameEl);

    var valueEl = new app.E('div');
    valueEl.sX(110);
    valueEl.sC('info-val');
    valueEl.e.style.right = 10 + 'px';
    bg.add(valueEl);
    valueEls.push(valueEl);
  }

  diagram.view.onDown(function () {
    view.sO(1);
    diagram.overlayLayer.sO(1);
    bgInputEnabled = true;
    render();
  });

  app.i.downHandlers.push(function () {
    var localY = chart.getInputY() - diagram.view.y;

    if (localY < 0 || localY > diagram.view.h) {
      view.sO(0);
      diagram.overlayLayer.sO(0);
      bgInputEnabled = false;
    }
  });

  app.i.moveHandlers.push(function onMouseMove(input) {
    input.isDown && render();
  });

  function onBgClick(e) {
    e.preventDefault();
    e.stopPropagation();

    cb(index);
  }

  function render() {
    var localY = chart.getInputY() - diagram.view.y,
      localX = chart.getInputX() - diagram.view.x,
      len, step;

    if (localY < 0 || localY > diagram.view.h || localX < 0 || localX > diagram.view.w) return;

    len = scrollBar.rightIndex - scrollBar.leftIndex;
    step = diagram.view.w / len;

    index = Math.min(scrollBar.rightIndex - 1, Math.floor(localX / step));
    localX = index * step;

    bg.e.style.bottom = diagram.view.h - localY + 20 + 'px';

    if (localX < bg.w + 10) {
      bg.sX(localX + step + 10);
    } else {
      bg.sX(localX - bg.w - 10);
    }

    if (line) {
      line.sX(localX);
    } else {
      overlayLeft.sW(Math.min(diagram.view.w - Math.max(3, step), localX));
      overlayRight.sW(Math.max(0, diagram.view.w - localX - Math.max(3, step)));
    }

    for (var i = 0, n = 0, l = nameEls.length, date, y; i < l; i++) {
      if (!buttons.views[i] || !buttons.views[i].isActive) {
        nameEls[i].sO(0);
        valueEls[i].sO(0);
        continue;
      }

      y = 26 + n * 20;
      nameEls[i].sO(1);
      valueEls[i].sO(1);
      nameEls[i].sY(y);
      valueEls[i].sY(y);
      nameEls[i].sT(buttons.views[i].name);
      valueEls[i].e.style.color = buttons.views[i].color;
      valueEls[i].sT(app.format(cols[i][index + 1], true));
      n++;
    }

    date = new Date(colX[scrollBar.leftIndex + index + 1]);
    mainText.sT(days[date.getUTCDay()] + ', ' + months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ' ' + date.getUTCFullYear());
    bg.sH(30 + n * 20);
  }

  return {
    setOver: function (overview) {
      colX = overview.columns[0];
      cols = overview.columns.slice(1);
      setTimeout(render, 0);
    },

    setDat: function (dat) {
      colX = dat.columns[0];
      cols = dat.columns.slice(1);
      setTimeout(render, 0);
    }
  }
};
