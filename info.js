;app.Info = function (chart, diagram, scrollBar, buttons, cb) {
  var index = 0,
    bgInputEnabled = false,
    nameEls = [],
    valueEls = [],
    view, line, bg, colX, cols,
    mainText,
    arrow,
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut'],
    months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  view = new app.E('div');
  view.sW(diagram.view.width);
  view.sH(diagram.view.height);
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
    bg.add(valueEl);
    valueEls.push(valueEl);
  }

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
    render();
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

    if (localY < 0 || localY > diagram.canvas.height || localX < 0 || localX > view.w) return;

    len = scrollBar.rightIndex - scrollBar.leftIndex;
    step = view.w / len;

    index = Math.round(localX / step);
    localX = index * step;

    bg.sX(Math.max(0, Math.min(view.w - bg.w, localX - bg.w / 2)));
    line.sX(localX);

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
      valueEls[i].sT(formatNumber(cols[i][index + 1], true));
      n++;
    }

    date = new Date(colX[index]);
    mainText.sT(days[date.getUTCDay()] + ', ' + months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ' ' + date.getUTCFullYear());
    bg.sH(30 + n * 20);
  }

  return {
    setOver: function (overview) {
      colX = overview.columns[0];
      cols = overview.columns.slice(1);
    },

    setDat: function (dat) {
      colX = dat.columns[0];
      cols = dat.columns.slice(1);
    }
  }
};
