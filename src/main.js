app.HLines = function (axes) {
  var lines = [], line, hash = {}, oldHash = {}, prevMainMinY, prevScaleY,
    lineColor = '#ffffff', textColor = '#ffffff';

  var view = new app.E('div');
  view.sY(250);

  var mainLine = new app.E('div');
  mainLine.sW(400);
  mainLine.sH(3);
  mainLine.sY(-1);
  view.add(mainLine);

  function createLine() {
    var line = new app.E('div');
    line.sW(400);
    line.sH(2);
    line.texts = [];
    view.add(line);

    for (var i = 0, text; i < axes.length; i++) {
      text = new app.E('div');

      if (i === 1) {
        text.e.style.right = 0 + 'px';
      }

      if (axes[i]) {
        text.e.style.color = axes[i];
      }

      text.sY(-16);
      line.add(text);
      line.texts.push(text);
    }

    setLineColor(line, lineColor, textColor);

    return line;
  }

  function addTween(elem, y) {
    elem.sC('tween');
    elem.sB(y);
  }

  function release(line) {
    line.rC('tween');
    lines.push(line);
  }

  function reset(dat) {
    prevScaleY = 1;
    prevMainMinY = 0;

    for (var key in hash) {
      lines.push(hash[key]);
      hash[key].sO(0);
    }

    hash = {};
  }

  function setLineColor(line, color, textColor) {
    line.e.style.backgroundColor = color;
    line.e.style.color = textColor;
  }

  return {
    setMode: function (isNight, config) {
      lineColor = isNight ? 'rgba(255,255,255,0.1)' : 'rgba(24,45,59,0.1)';
      textColor = config.axisText.y || config.axisText;
      lines.forEach(line => setLineColor(line, lineColor, textColor));

      for (var key in oldHash) {
        setLineColor(oldHash[key], lineColor, textColor);
      }

      for (var key in hash) {
        setLineColor(hash[key], lineColor, textColor);
      }
    },

    addTo: function (parent) {
      parent.add(view);
    },

    setOver: function (overview) {
      reset(overview);
    },

    setDat: function (dat) {
      reset(dat);
    },

    render: function (minY, scaleY, offsetY, mainMinY, mainScaleY, mainOffsetY) {
      var i, j, y, text;
      oldHash = hash;
      hash = {};

      for (i = 0, y = mainMinY; i < 6; y += mainOffsetY, i++) {
        line = oldHash[y];

        if (!line) {
          line = lines.pop();

          if (!line) {
            line = createLine();
            view.add(line);
          }

          line.index = y;
          line.sO(1);
          line.sB((y - prevMainMinY) * prevScaleY);
          setTimeout(addTween, 0, line, (y - mainMinY) * mainScaleY);
        } else {
          line.sB((y - mainMinY) * mainScaleY);
        }

        for (j = 0; j < axes.length; j++) {
          text = line.texts[j];
          text.sT(app.format(minY[j] + offsetY[j] * i));
        }

        hash[line.index] = line;
      }

      for (var key in oldHash) {
        line = oldHash[key];

        if (!hash[line.index]) {
          line.sB((line.index - mainMinY) * mainScaleY);
          line.sO(0);
          setTimeout(release, 500, line);
        }
      }

      prevMainMinY = mainMinY;
      prevScaleY = mainScaleY;
    }
  }
};

app.Header = function (parent, chartName, cb) {
  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    getDateStr = getDateStrOver,
    title, zoomOut, zoomOutContainer, data, rangeText, icon,
    dayMs = 1000 * 60 * 60 * 24,
    monthMs = dayMs * 31,
    rangeTexts = [];

  title = new app.E('div');
  title.sT(chartName);
  title.sC('tween');
  title.sC('title');
  title.sY(20);
  parent.add(title);

  zoomOutContainer = new app.E('div');
  zoomOutContainer.inputEnabled = false;
  zoomOutContainer.e.style.position = 'relative';
  zoomOutContainer.sC('tween');
  zoomOutContainer.sC('pointer');
  zoomOutContainer.sY(20);
  zoomOutContainer.sS(1, 0);
  parent.add(zoomOutContainer);

  zoomOutContainer.onDown(function () {
    zoomOutContainer.inputEnabled && cb();
  });

  icon = document.createElement('img');
  icon.src = 'img/zoom-out.png';
  icon.classList.add('zoom-icon');
  zoomOutContainer.e.appendChild(icon);

  zoomOut = new app.E('div');
  zoomOut.sC('zoom');
  zoomOut.sT('Zoom Out');
  zoomOutContainer.add(zoomOut);

  var rangeTextsContainer = new app.E('div');
  rangeTextsContainer.sY(6);
  rangeTextsContainer.e.style.right = '0px';
  parent.add(rangeTextsContainer);

  for (var j = 0; j < 9; j++) {
    rangeText = new app.E('div');
    rangeText.sY(20);
    rangeText.sC('range-text');
    rangeText.sC('tween');
    rangeText.sS(1, 0);
    rangeTextsContainer.add(rangeText);
    rangeTexts.push(rangeText);
  }

  function getDateStrOver(leftTime, rightTime) {
    var leftDate = new Date(leftTime);
    var rightDate = new Date(rightTime);
    var res = [
      '', '',
      leftDate.getUTCDate() + '&nbsp;',
      app.months[leftDate.getUTCMonth()] + '&nbsp;',
      String(leftDate.getUTCFullYear())
    ];

    if (rightDate.getUTCMonth() - leftDate.getUTCMonth() > 1 || rightDate.getTime() - leftDate.getTime() > monthMs) {
      res.push(
        '&nbsp;-&nbsp;',
        rightDate.getUTCDate() + '&nbsp;',
        app.months[rightDate.getUTCMonth()] + '&nbsp;',
        String(rightDate.getUTCFullYear())
      );
    } else {
      res.unshift('', '', '', '');
    }

    return res;
  }

  function getDateStrDat(leftTime, rightTime) {
    var leftDate = new Date(leftTime);
    var rightDate = new Date(rightTime);
    var res = [
      days[leftDate.getUTCDay()] + ',&nbsp;',
      leftDate.getUTCDate() + '&nbsp;',
      app.months[leftDate.getUTCMonth()] + '&nbsp;',
      String(leftDate.getUTCFullYear())
    ];

    if (rightDate.getUTCDate() - leftDate.getUTCDate() > 1 || rightDate.getTime() - leftDate.getTime() > dayMs) {
      res.push(
        '&nbsp;-&nbsp;',
        days[rightDate.getUTCDay()] + ',&nbsp;',
        rightDate.getUTCDate() + '&nbsp;',
        app.months[rightDate.getUTCMonth()] + '&nbsp;',
        String(rightDate.getUTCFullYear())
      );
    } else {
      res.unshift('', '', '', '', '');
    }

    return res;
  }

  function show(el, text) {
    el.sS(1, 1);
    el.e.innerHTML = text;
  }

  return {
    setOver: function (overview) {
      data = overview;
      zoomOutContainer.inputEnabled = false;
      title.sS(1, 1);
      zoomOutContainer.sS(1, 0);
      getDateStr = getDateStrOver;
    },

    setDat: function (dat) {
      data = dat;
      zoomOutContainer.inputEnabled = true;
      title.sS(1, 0);
      zoomOutContainer.sS(1, 1);
      getDateStr = getDateStrDat;
    },

    setMode: function (isNight) {
      var defaultTextColor = isNight ? '#ffffff' : '#000000';
      zoomOut.e.style.color = isNight ? '#48AAF0' : '#108BE3';
      title.e.style.color = defaultTextColor;
      rangeTexts.forEach(text => text.e.style.color = defaultTextColor);
    },

    setRange: function (leftIndex, rightIndex) {
      var rowTexts = getDateStr(data.columns[0][leftIndex + 1], data.columns[0][rightIndex + 1]).reverse();

      for (var j = 0; j < rowTexts.length; j++) {
        if (rowTexts[j] !== rangeTexts[j].e.innerHTML) {
          rangeTexts[j].sS(1, 0);
          setTimeout(show, 80, rangeTexts[j], rowTexts[j]);
        }
      }
    }
  }
};

app.Info = function (chart, diagram, scrollBar, buttons, isSingle, colsLen, cb) {
  var index = 0, i, j,
    bgInputEnabled = false,
    nameEls = [],
    valueEls = [],
    view, line, bg, colX, cols,
    arrow,
    isBar,
    overlayLeft, overlayRight,
    circles = [],
    mainTexts = [],
    mainTextContainer,
    getMainText = getMainTextOverview,
    defaultTextColor = '#000000',
    cirleBgColor = '#ffffff',
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sut', 'Sun'],
    months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  view = new app.E('div');
  view.sC('tween');
  view.sW(diagram.view.w);
  view.sH(diagram.view.h);
  view.sO(0);
  view.sY(0);
  diagram.view.add(view);

  overlayLeft = new app.E('div');
  overlayLeft.sW(0);
  overlayLeft.sH(diagram.view.h);
  overlayLeft.sC('info-overlay');
  diagram.overlayLayer.add(overlayLeft);

  overlayRight = new app.E('div');
  overlayRight.sW(0);
  overlayRight.sH(diagram.view.h);
  overlayRight.e.style.right = 0 + 'px';
  overlayRight.sC('info-overlay');
  diagram.overlayLayer.add(overlayRight);

  line = new app.E('div');
  line.sW(2);
  line.sY(0);
  line.sH(diagram.view.h);
  line.sC('info-line');
  view.add(line);

  bg = new app.E('div');
  bg.sC('info-bg');
  bg.sW(140);
  bg.sH(60);
  bg.onDown(onBgClick);
  view.add(bg);

  mainTextContainer = new app.E('div');
  mainTextContainer.sX(10);
  mainTextContainer.sY(4);
  bg.add(mainTextContainer);

  for (j = 0; j < 5; j++) {
    var mainText = new app.E('div');
    mainText.sC('info-main-text');
    mainText.sC('tween');
    mainTextContainer.add(mainText);

    mainTexts[j] = mainText;
  }

  arrow = document.createElement('i');
  arrow.classList.add('arrow-right');
  arrow.style.right = 7 + 'px';
  arrow.style.top = 7 + 'px';
  arrow.style.position = 'absolute';
  bg.e.appendChild(arrow);

  for (i = 0; i <= colsLen; i++) {
    var nameEl = new app.E('div');
    bg.add(nameEl);
    nameEl.sC('info-name');
    nameEl.sX(10);
    nameEls.push(nameEl);

    var valueEl = new app.E('div');
    valueEl.sC('info-val');
    valueEl.sC('tween');
    valueEl.e.style.right = 8 + 'px';
    bg.add(valueEl);
    valueEls.push(valueEl);
  }

  diagram.view.onDown(function () {
    view.sO(1);
    diagram.overlayLayer.sO(1);

    setTimeout(function () {
      bgInputEnabled = true;
      bg.e.style.cursor = 'pointer';
      render();
    }, 0);
  });

  for (i = 0; i < colsLen; i++) {
    var circle = new app.E('div');
    circle.sW(8);
    circle.sH(8);
    circle.sX(-6);
    circle.e.style.border = '2px solid';
    circle.e.style.borderRadius = '6px';
    circles.push(circle);
    line.add(circle);
  }

  app.i.downHandlers.push(function () {
    var localY = chart.getInputY() - diagram.view.y;

    if (localY < 0 || localY > diagram.view.h) {
      view.sO(0);
      diagram.overlayLayer.sO(0);
      bgInputEnabled = false;
      bg.e.style.cursor = 'default';
    }
  });

  app.i.moveHandlers.push(function onMouseMove(input) {
    input.isDown && render();
  });

  function onBgClick(e) {
    if (!bgInputEnabled) return;
    e.preventDefault();
    e.stopPropagation();

    cb(index);
  }

  function getMainTextOverview(date) {
    return [
      days[date.getUTCDay()],
      ',&nbsp;',
      months[date.getUTCMonth()] + '&nbsp;',
      date.getUTCDate() + '&nbsp;',
      String(date.getUTCFullYear())
    ];
  }

  function getMainTextDat(date) {
    var hours = date.getUTCHours();
    var mins = date.getUTCMinutes();

    return [
      hours < 10 ? '0' : '',
      String(hours),
      ':',
      mins < 10 ? '0' : '',
      String(mins)
    ];
  }

  function show(elem, text) {
    elem.sS(1, 1);
    elem.e.innerHTML = text;
  }

  function render() {
    var localY = chart.getInputY() - diagram.view.y,
      localX = chart.getInputX() - diagram.view.x,
      len, step, i, j, y, n, l, sum, value, valueEl, nameEl, elemsToShow = [], btnName, btnColor;

    len = scrollBar.rightIndex - scrollBar.leftIndex;
    step = diagram.view.w / len;

    if (localY < 0 || localY > diagram.view.h || localX < 0 || localX > diagram.view.w + step) return;

    index = Math.min(scrollBar.rightIndex - (isBar ? 1 : 0), Math.floor(localX / step));
    localX = index * step;

    bg.e.style.top = Math.max(-10, Math.min(diagram.view.h - bg.h - 10, localY - bg.h - 60)) + 'px';

    if (localX < bg.w + 20) {
      bg.sX(localX + step + 20);
    } else {
      bg.sX(localX - bg.w - 20);
    }

    if (isBar) {
      overlayLeft.sW(Math.min(diagram.view.w - Math.max(3, step), localX));
      overlayRight.sW(Math.max(0, diagram.view.w - localX - Math.max(3, step)));
      diagram.overlayLayer.sO(1);
      line.sX(100500);
    } else {
      diagram.overlayLayer.sO(0);
      line.sX(localX);

      for (i = 0; i < buttons.views.length; i++) {
        var circle = circles[i];

        if (buttons.views[i].isActive) {
          circle.e.style.backgroundColor = cirleBgColor;
          circle.e.style.borderColor = buttons.views[i].tooltipColor;
          circle.sY(diagram.view.h - diagram.getY(i, scrollBar.leftIndex + index) + circle.x);
          circle.sO(1);
        } else {
          circle.sO(0);
        }
      }
    }

    for (i = 0, n = 0, l = nameEls.length, sum = 0; i < l; i++) {
      valueEl = valueEls[i];
      nameEl = nameEls[i];

      if (i === buttons.views.length && i > 1 && !isSingle) {
        value = app.format(sum);
        btnName = 'All';
        btnColor = defaultTextColor;
        valueEl.sC('bold');
      } else if (!buttons.views[i] || !buttons.views[i].isActive) {
        nameEl.sS(1, 0);
        valueEl.sS(1, 0);
        nameEl.sT('');
        valueEl.sT('');

        continue;
      } else {
        sum += cols[i][index + 1];
        value = app.format(cols[i][index + 1]);
        btnName = buttons.views[i].name;
        btnColor = buttons.views[i].tooltipColor;
        valueEl.rC('bold');
      }

      y = 26 + n * 20;
      nameEl.sY(y);
      valueEl.sY(y);
      nameEl.sS(1, 1);
      valueEl.sS(1, 1);
      nameEl.sT(btnName);
      nameEl.e.style.color = defaultTextColor;
      valueEl.e.style.color = btnColor || defaultTextColor;

      if (valueEls[i].e.innerHTML !== value) {
        valueEl.sS(1, 0);
        setTimeout(show, 80, valueEl, value);
      }

      n++;
    }

    bg.sH(30 + n * 20);
    var newTexts = getMainText(new Date(colX[scrollBar.leftIndex + index + 1]));

    for (j = 0; j < newTexts.length; j++) {
      mainTexts[j].e.style.color = defaultTextColor;

      if (newTexts[j] !== mainTexts[j].e.innerHTML) {
        mainTexts[j].sS(1, 0);
        mainTexts[j].e.innerHTML = newTexts[j];

        setTimeout(show, 80, mainTexts[j], newTexts[j]);
      }
    }
  }

  function reset(dat) {
    colX = dat.columns[0];
    cols = dat.columns.slice(1);
    setTimeout(render, 0);
  }

  return {
    setOver: function (overview) {
      reset(overview);
      isBar = overview.types.y0 === 'bar';
      arrow.style.visibility = 'visible';
      getMainText = getMainTextOverview;
    },

    setDat: function (dat) {
      reset(dat);
      isBar = dat.types.y0 === 'bar' && !isSingle;
      arrow.style.visibility = 'hidden';
      getMainText = getMainTextDat;
    },

    setMode: function (isNight, bgColor) {
      var overlayColor = isNight ? 'rgba(36,47,62,0.5)' : 'rgba(255,255,255,0.5)';
      overlayLeft.e.style.backgroundColor = overlayColor;
      overlayRight.e.style.backgroundColor = overlayColor;
      bg.e.style.backgroundColor = isNight ? '#1C2533' : '#ffffff';
      arrow.style.borderColor = isNight ? '#D2D5D7' : '#D2D5D7';
      defaultTextColor = isNight ? '#ffffff' : '#000000';
      cirleBgColor = bgColor;
    },

    render: render
  }
};

app.Buttons = function (parent, isSingle, dat, cb) {
  var buttons, view, mainBgColor = '#ffffff';

  view = new app.E('div');
  view.sY(450);
  parent.add(view);

  var names = [];

  dat.columns.slice(1).forEach(function (col) {
    names.push(dat.names[col[0]]);
  });

  function removeShake(btn) {
    btn.rC('shake');
  }

  function shake(btn) {
    btn.sC('shake');
    setTimeout(removeShake, 300, btn);
  }

  function getActiveCount() {
    var res = 0;

    for (var i = 0; i < buttons.length; i++) {
      res += buttons[i].isActive ? 1 : 0;
    }

    return res;
  }

  function turnOffAllBeside(button) {
    var i, s, l, btn;
    button.isDown = false;

    for (i = 0, l = buttons.length; i < l; i++) {
      btn = buttons[i];
      btn.isActive = btn === button;
      s = btn.isActive ? 1 : 0;
      btn.tick.sS(s, s);

      btn.e.style.backgroundColor = btn.isActive ? btn.color : mainBgColor;
    }

    cb(buttons);
  }

  buttons = names.map(function (name, i) {
    var button, tick, text, timeout, downTime;

    button = new app.E('div');
    button.name = name;
    button.sC('button');
    view.add(button);

    tick = new app.E('img');
    tick.e.src = 'img/tick.png';
    tick.sC('tween');
    tick.sC('tick');
    button.add(tick);

    text = new app.E('span');
    text.sC('button-text');
    text.sT(name);
    button.add(text);

    button.isActive = true;
    button.tick = tick;
    button.text = text;

    button.onDown(function () {
      button.isDown = true;
      downTime = Date.now();
      timeout = setTimeout(turnOffAllBeside, 200, button);
    });

    button.onUp(function onUp() {
      if (!button.isDown || Date.now() - downTime > 200) return;
      button.isDown = false;

      clearTimeout(timeout);

      if (getActiveCount() === 1 && button.isActive) {
        shake(button);
        return;
      }

      button.isActive = !button.isActive;
      button.e.style.backgroundColor = button.isActive ? button.color : mainBgColor;

      var s = button.isActive ? 1 : 0;
      tick.sS(s, s);

      cb(buttons);
    });

    return button;
  });

  return {
    setOver: function (overview) {
      if (isSingle) {
        this.views = [{isActive: true, name: overview.names.y0}];
        view.sO(0);
      } else {
        this.views = buttons;
      }
    },

    setDat: function (dat) {
      view.sO(1);
      this.views = buttons;

      if (isSingle) {
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].name = dat.names[dat.columns[i + 1][0]];
          buttons[i].text.sT(buttons[i].name);
        }
      }
    },

    setMode: function (isNight, config, bgColor) {
      mainBgColor = bgColor;

      buttons.forEach((button, i) => {
        button.color = config.buttons[dat.columns[i + 1][0]];
        button.tooltipColor = config.tooltip[dat.columns[i + 1][0]];
        button.e.style.borderColor = button.color;
        button.e.style.backgroundColor = button.isActive ? button.color : mainBgColor;
      });
    },

    views: null
  };
};

app.AxisX = function (parent) {
  var elems = [], prevLeftIndex, prevScaleX;
  var hash = {}, oldHash = {}, colX, texts, textColor = '#ffffff';
  app.months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var view = new app.E('div');
  view.sY(250);
  parent.add(view);

  function createElem() {
    var elem = new app.E('div');
    elem.sT(0);
    elem.sW(50);
    elem.sY(6);
    elem.e.style.color = textColor;
    parent.add(elem);

    return elem;
  }

  function addTween(elem, x) {
    elem.sC('tween');
    elem.sX(x);
  }

  function release(elem) {
    elem.rC('tween');
    elems.push(elem);
  }

  function reset() {
    prevScaleX = 1;
    prevLeftIndex = 0;

    for (var key in hash) {
      elems.push(hash[key]);
      hash[key].sO(0);
    }

    hash = {};
  }

  return {
    setOver: function (overview) {
      reset();
      colX = overview.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time);
        return date.getUTCDate() + ' ' + app.months[date.getUTCMonth()];
      });
    },

    setDat: function (dat) {
      reset();
      colX = dat.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time),
          hours = date.getUTCHours(),
          mins = date.getUTCMinutes();

        return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
      });
    },

    setMode: function (isNight, config) {
      textColor = config.axisText.x || config.axisText;
      elems.forEach(elem => elem.e.style.color = textColor);

      for (var key in oldHash) {
        oldHash[key].e.style.color = textColor;
      }

      for (var key in hash) {
        hash[key].e.style.color = textColor;
      }
    },

    render: function (leftIndex, rightIndex, scaleX) {
      var desOffset = Math.floor((rightIndex - leftIndex) / 5);
      var offset = 1;

      while (offset < desOffset) offset *= 1.4;
      offset = Math.floor(offset);

      var elem;
      var i = leftIndex;
      var l = rightIndex;

      oldHash = hash;
      hash = {};

      for (; i <= l; i += offset) {
        if (i < 0) continue;

        elem = oldHash[i];

        if (!elem) {
          elem = elems.pop();

          if (!elem) {
            elem = createElem();
            view.add(elem);
          }

          elem.index = i;
          elem.sO(1);
          elem.sT(texts[i]);
          elem.sX((colX[i] - colX[prevLeftIndex]) * prevScaleX);
          setTimeout(addTween, 1, elem, (colX[i] - colX[leftIndex]) * scaleX);
        } else {
          elem.sX((colX[i] - colX[leftIndex]) * scaleX);
        }

        hash[elem.index] = elem;
      }

      for (var key in oldHash) {
        elem = oldHash[key];

        if (!hash[elem.index]) {
          elem.sX((colX[elem.index] - colX[leftIndex]) * scaleX);
          elem.sO(0);
          setTimeout(release, 500, elem);
        }
      }

      prevLeftIndex = leftIndex;
      prevScaleX = scaleX;
    }
  }
};

app.Chart = function (contest, chartIndex, chartName) {
  var Elem = app.E,
    input = app.i,
    overview = contest.overview,
    data = contest.data,
    leftIndex = 0,
    isSingle = chartIndex === 3,
    rightIndex = Math.min(90, overview.columns[0].length - 2),
    body = document.body,
    index, view, diagram, axisX, buttons, header, scrollBar, info, hLines, isOverMode, isInited;

  var chart = {
    getInputX: function getInputX() {
      return (input.x - view.x) / view.sc; // + app.getScrollX();
    },

    getInputY: function () {
      return (input.y + app.getScrollY() - view.y) / view.sc;
    }
  };

  view = new Elem('div');
  body.appendChild(view.e);
  view.sW(400);
  view.sH(540);
  view.sC('chart');

  header = app.Header(view, chartName, onOverMode);
  buttons = app.Buttons(view, isSingle, data[0] || overview, onButtonClick);

  hLines = new app.HLines(overview.y_scaled ? [overview.colors.y0, overview.colors.y1] : ['']);

  var Diagram = app.Diagram; //overview.percentage ? app.DiagramP : app.Diagram;
  diagram = Diagram(400, 250, buttons, hLines, true);
  diagram.view.sX(0);
  diagram.view.sY(80);
  view.add(diagram.view);

  axisX = app.AxisX(diagram.view);

  scrollBar = app.ScrollBar(chart, buttons, isSingle, onRangeChange);
  view.add(scrollBar.view);

  var maxColsLen = (data[0] || overview).columns.length - 1;
  info = app.Info(chart, diagram, scrollBar, buttons, isSingle, maxColsLen, onDatMode);

  function onButtonClick() {
    scrollBar.renderDiagram();
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX);
  }

  function onRangeChange() {
    header.setRange(scrollBar.leftIndex, scrollBar.rightIndex);
    diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX);
  }

  function onOverMode() {
    isInited = true;
    isOverMode = true;
    header.setOver(overview);
    buttons.setOver(overview);
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

    var dat = data[i] || overview;
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

    var newLeftIndex = Math.floor((dat.columns[0].length - 1) / 2 / 24) * 24;
    scrollBar.setRange(newLeftIndex, newLeftIndex + 24);
    scrollBar.renderDiagram();
  }

  return {
    view: view,
    onOverMode: onOverMode,

    setMode: function (isNight, bgColor) {
      var config = app.config[isNight ? 'night' : 'day'][chartIndex];

      diagram.setMode(isNight, config);
      scrollBar.setMode(isNight, config);
      buttons.setMode(isNight, config, bgColor);
      hLines.setMode(isNight, config);
      axisX.setMode(isNight, config);
      header.setMode(isNight);
      info.setMode(isNight, bgColor);
      diagram.bgColor = bgColor;
      scrollBar.diagram.bgColor = bgColor;

      if (isInited) {
        info.render();
        diagram.render(scrollBar.leftIndex, scrollBar.rightIndex, axisX);
        scrollBar.renderDiagram();
      }
    }
  };
};

app.Diagram = function (width, height, buttons, hLines, addReserve) {
  var colX, cols, yScaled, stacked, types,
    prevScaleX = 0, prevScaleY = [], prevMaxY = [],
    prevLeftIndex = -1, prevRightIndex, animate, steps = 5, colsLength,
    maxX, minX, scaleX,
    mainMinY = Number.MAX_VALUE,
    mainMaxY = -Number.MAX_VALUE,
    scaleY = [], offsetY = [], minY = [], maxY = [], render,
    canvases = [], canvasContainers = [], contexts = [], canvasContainer, canvas, ctx, canvasesLen,
    mainOffset, mainScaleY,
    stack = [],
    curDat,
    calcBounds,
    canvasReserveX = addReserve ? 400 : 0, modeConfig;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  var overflow = new app.E('div');
  overflow.e.style.overflow = 'hidden';
  overflow.sW(width);
  overflow.sH(height);
  view.add(overflow);

  var overlayLayer = new app.E('div');
  overlayLayer.sW(view.w);
  overlayLayer.sH(view.h);
  overlayLayer.sO(0);
  view.add(overlayLayer);

  hLines && hLines.addTo(view);

  function init(dat) {
    reset(dat);
    init = reset;

    for (var i = 0; i < canvasesLen; i++) {
      canvasContainer = new app.E('div');
      overflow.add(canvasContainer);

      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d', {alpha: canvasesLen !== 1});
      canvas.width = width + canvasReserveX * 2;
      canvas.height = height;
      canvas.style.transform = 'scale(1, -1)';
      canvas.style.height = height + 'px';
      canvas.style.position = 'absolute';
      canvasContainer.e.appendChild(canvas);

      canvases[i] = canvas;
      contexts[i] = ctx;
      canvasContainers[i] = canvasContainer;
    }

    if (!yScaled) {
      for (i = 1; i < colsLength; i++) {
        canvases[i] = canvases[0];
        contexts[i] = contexts[0];
        canvasContainers[i] = canvasContainers[0];
      }
    }
  }

  function reset(dat) {
    curDat = dat;
    animate = false;
    colX = dat.columns[0].slice(1);
    types = dat.types;
    yScaled = dat.y_scaled;
    stacked = dat.stacked || types.y0 === 'bar';

    cols = dat.columns.slice(1).map(function (col) {
      col = col.slice(1);

      return col;
    });

    colsLength = cols.length;

    if (stacked) {
      render = renderStacked;
      calcBounds = stackedCalcBounds;
    } else {
      render = renderLines;
      calcBounds = linesCalcBounds;
    }

    canvasesLen = yScaled ? colsLength : 1;
    prevScaleX = width / (colX[colX.length - 1] - colX[0]);
  }

  function startAnimation() {
    animate = false;

    for (var i = 0; i < canvasesLen; i++) {
      canvas = canvases[i];
      canvas.style.width = canvasReserveX * 2 + width + 'px';
      canvas.style.height = canvas.height + 'px';
      canvas.style.top = 0 + 'px';
      canvas.style.left = 0 + 'px';
      canvas.classList.add('tween');
    }
  }

  return {
    view: view,
    bgColor: '#ffffff',
    overlayLayer: overlayLayer,

    setOver: function (overview) {
      init(overview);
    },

    setDat: function (dat) {
      init(dat);
    },

    setMode: function (isNight, config) {
      modeConfig = config;
    },

    getY: function (colIndex, index) {
      return (cols[colIndex][index] - minY[colIndex]) * scaleY[colIndex];
    },

    render: function (leftIndex, rightIndex, axisX) {
      var i, newLeftIndex, newRightIndex;

      var reservedIndex = Math.ceil((rightIndex - leftIndex));
      var reserveLeft, reserveRight;

      if (leftIndex !== prevLeftIndex && rightIndex !== prevRightIndex) {
        reserveLeft = 1;
        reserveRight = 1;
      } else if (leftIndex !== prevLeftIndex) {
        reserveLeft = 2;
        reserveRight = 0;
      } else {
        reserveLeft = 0;
        reserveRight = 2;
      }

      newLeftIndex = Math.max(0, leftIndex - Math.floor(reservedIndex * reserveLeft));
      newRightIndex = Math.min(colX.length - 1, rightIndex + Math.floor(reservedIndex * reserveRight));

      calcBounds(leftIndex, rightIndex, newLeftIndex, newRightIndex);

      contexts[0].fillStyle = this.bgColor;
      contexts[0].fillRect(0, 0, canvas.width, canvas.height);
      yScaled && contexts[1].clearRect(0, 0, canvas.width, canvas.height);

      if (mainMinY === Number.MAX_VALUE) return;

      axisX && axisX.render(leftIndex, rightIndex, scaleX);
      hLines && hLines.render(minY, scaleY, offsetY, mainMinY, mainScaleY, mainOffset);

      if (!animate) {
        animate = true;

        for (i = 0; i < canvasesLen; i++) {
          canvas = canvases[i];
          canvasContainer = canvasContainers[i];

          canvas.style.top = (prevMaxY[i] - maxY[i]) * prevScaleY[i] + 'px';
          canvas.style.height = (parseInt(canvas.style.height)) * prevScaleY[i] / scaleY[i] + 'px';

          canvas.style.width = (parseInt(canvas.style.width)) * prevScaleX / scaleX + 'px';
          canvas.classList.remove('tween');

          var canvasContainerX = canvasContainer.x;
          canvasContainer.sX((colX[newLeftIndex] - minX) * scaleX);
          canvas.style.left = canvasContainerX - canvasContainer.x +
            (colX[newLeftIndex] - colX[prevLeftIndex]) * prevScaleX + 'px';

          prevScaleY[i] = scaleY[i];
          prevMaxY[i] = maxY[i];
        }

        setTimeout(startAnimation, 0);
      }

      prevScaleX = scaleX;
      prevLeftIndex = newLeftIndex;
      prevRightIndex = newRightIndex;

      minX = colX[newLeftIndex];
      maxX = colX[newRightIndex];

      render(newLeftIndex, newRightIndex);
    }
  };

  function renderLines(leftIndex, rightIndex) {
    var i, j, col;

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];
      ctx = contexts[i] || contexts[0];

      ctx.beginPath();
      ctx.moveTo((colX[leftIndex] - minX) * scaleX, (col[leftIndex] - minY[i]) * scaleY[i]);

      for (j = leftIndex + 1; j <= rightIndex; j++) {
        ctx.lineTo((colX[j] - minX) * scaleX, (col[j] - minY[i]) * scaleY[i]);
      }

      ctx.strokeStyle = modeConfig.lines[curDat.columns[i + 1][0]];
      ctx.stroke();
    }
  }

  function renderStacked(leftIndex, rightIndex) {
    var i, j, x, y, offsetX, col;
    offsetX = (colX[rightIndex] - minX) * scaleX / (rightIndex - leftIndex);

    for (i = cols.length - 1; i >= 0; i--) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];

      x = (colX[leftIndex] - minX) * scaleX;

      ctx.beginPath();
      ctx.moveTo(x, 0);

      for (j = leftIndex; j <= rightIndex; j++, x += offsetX) {
        y = (stack[j] - mainMinY) * mainScaleY;
        stack[j] -= col[j];
        ctx.lineTo(x, y);
        ctx.lineTo(x + offsetX, y);
      }

      ctx.lineTo(x, 0);
      ctx.closePath();

      ctx.fillStyle = modeConfig.lines[curDat.columns[i + 1][0]];
      ctx.fill();
    }
  }

  function stackedCalcBounds(leftIndex, rightIndex, newLeftIndex, newRightIndex) {
    var i, j;
    stack.length = 0;
    mainMaxY = -Number.MAX_VALUE;

    for (j = newLeftIndex; j <= newRightIndex; j++) {
      stack[j] = 0;
    }

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;

      for (j = newLeftIndex; j <= newRightIndex; j++) {
        stack[j] += cols[i][j];
      }
    }

    for (j = leftIndex; j <= rightIndex; j++) {
      mainMaxY = Math.max(mainMaxY, stack[j]);
    }

    mainMinY = 0;
    calcBoundsCommon(leftIndex, rightIndex);
  }

  function linesCalcBounds(leftIndex, rightIndex) {
    var i, j, col;
    mainMinY = Number.MAX_VALUE;
    mainMaxY = -Number.MAX_VALUE;

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];
      minY[i] = Number.MAX_VALUE;
      maxY[i] = -Number.MAX_VALUE;

      for (j = leftIndex; j <= rightIndex; j++) {
        minY[i] = Math.min(minY[i], col[j]);
        maxY[i] = Math.max(maxY[i], col[j]);
      }

      offsetY[i] = Math.max(1, Math.floor((maxY[i] - minY[i]) / steps));
      mainMaxY = Math.max(maxY[i], mainMaxY);
      mainMinY = Math.min(minY[i], mainMinY);
    }

    mainMinY = mainMinY === mainMaxY ? 0 : mainMinY;
    calcBoundsCommon(leftIndex, rightIndex);
  }

  function calcBoundsCommon(leftIndex, rightIndex) {
    var i;
    minX = colX[leftIndex];
    maxX = colX[rightIndex];
    scaleX = width / (maxX - minX);
    mainMinY = app.round(mainMinY, 'floor');
    mainOffset = Math.max(1, Math.floor((mainMaxY - mainMinY) / steps));
    mainOffset = app.round(mainOffset, 'ceil');
    mainMaxY = mainMinY + mainOffset * steps;
    mainScaleY = height / (mainMaxY - mainMinY);

    if (yScaled) {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY * mainOffset / offsetY[i];
      }
    } else {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY;
        minY[i] = mainMinY;
        maxY[i] = mainMaxY;
        offsetY[i] = mainOffset;
      }
    }
  }
};

app.DiagramP = function (width, height, buttons, hLines, addReserve) {
  var canvas, ctx;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d', {alpha: false});
  canvas.width = width;
  canvas.height = height;
  canvas.style.transform = 'scale(1, -1)';
  canvas.style.height = height + 'px';
  canvas.style.position = 'absolute';
  view.e.appendChild(canvas);

  return {
    view: view,
    bgColor: '#ffffff',
    overlayLayer: new app.E('div'),

    setOver: function (overview) {

    },

    setDat: function (dat) {
    },

    getY: function (colIndex, index) {
      // return (cols[colIndex][index] - minY[colIndex]) * scaleY[colIndex];
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {

    }
  }
};

app.ScrollBar = function (chart, buttons, isSingle, cb) {
  var Elem = app.E,
    offsetTB = 2,
    sideWidth = 20,
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
  frame.sH(height + offsetTB * 2);
  frame.sC('frame');
  frame.sC('tween');
  view.add(frame);
  frame.onDown(function () {
    moveHandler = frameMove;
  });

  sides = [leftSideMove, rightSideMove].map(function (handler, i) {
    var overlay = new Elem('div');
    overlay.sH(view.h);
    overlay.sC('tween');
    overlay.sC(i === 0 ? 'scroll-overlay-left' : 'scroll-overlay-right');
    view.add(overlay);

    var side = new Elem('div');
    side.sY(-offsetTB);
    side.sW(sideWidth);
    side.sH(view.h + offsetTB * 2);
    side.sC('side');
    side.sC(i === 0 ? 'side-left' : 'side-right');
    side.sC('tween');
    view.add(side);
    side.onDown(function () {
      moveHandler = handler;
    });

    var handle = new app.E('div');
    handle.sX(side.w / 2 - 2);
    handle.sY(side.h / 2 - 8);
    handle.sW(3);
    handle.sH(16);
    handle.e.style.backgroundColor = '#ffffff';
    side.add(handle);

    side.overlay = overlay;

    return side;
  });

  function updateAnchors(dat, checkCb) {
    anchorsX.length = 0;
    anchorsMap.length = 0;
    anchorsX.push(0);
    anchorsMap.push(0);

    var colX = dat.columns[0], i, l;

    for (i = 2, l = colX.length - 1; i < l; i++) {
      if (checkCb(new Date(colX[i]), i)) {
        anchorsX.push((i - 1) / (l - 2) * width);
        anchorsMap.push(i - 1);
      }
    }

    anchorsX.push(width);
    anchorsMap.push(l - 1);
  }

  sideLeft = sides[0];
  sideRight = sides[1];
  sideRight.overlay.e.style.right = '0px';

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

      if (isSingle) {
        updateAnchors(dat, function (date, i) {
          return i % 36 === 1;
        });
      } else {
        updateAnchors(dat, function (date) {
          return date.getUTCHours() === 0;
        });
      }
    },

    setMode: function (isNight, config) {
      diagram.setMode(isNight, config);
      var overlayColor = isNight ? 'rgba(48,66,89,0.6)' : 'rgba(226,238,249,0.6)';
      var sideColor = isNight ? '#56626D' : '#C0D1E1';
      frame.e.style.borderColor = sideColor;

      sides.forEach(side => {
        side.overlay.e.style.backgroundColor = overlayColor;
        side.e.style.backgroundColor = sideColor;
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
    frame.sX(sideLeft.x + sideWidth);
    frame.sW(sideRight.x - sideLeft.x - sideWidth);

    sideLeft.overlay.sW(Math.max(0, sideLeft.x + sideWidth));
    sideRight.overlay.sW(view.w - sideRight.x);

    cb(leftIndex, rightIndex);
  }

  function getLocalX() {
    return chart.getInputX() - view.x;
  }

  function getIndex(x) {
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

app.i = (function () {
  var input = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    isDown: false,
    moveHandlers: [],
    upHandlers: [],
    downHandlers: []
  };

  function onMouseDown(e) {
    e.preventDefault && e.preventDefault();
    input.x = e.clientX;
    input.y = e.clientY;
    input.isDown = true;

    for (var i = 0, h = input.downHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    onMouseDown(e.touches[0]);
  }

  function onMouseUp(e) {
    e.preventDefault && e.preventDefault();
    input.isDown = false;

    for (var i = 0, h = input.upHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();
    onMouseUp(e);
  }

  function onMouseMove(e) {
    e.preventDefault && e.preventDefault();
    input.x = e.clientX;
    input.y = e.clientY;

    for (var i = 0, h = input.moveHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    onMouseMove(e.touches[0]);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);

  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchend', onTouchEnd);

  return input;
}());

app.E = (function () {
  function E(tag) {
    var e = document.createElement(tag);
    e.style.position = 'absolute';

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.o = 1;
    this.e = e;
  }

  var p = E.prototype;

  p.constructor = E;

  p.gX = function () {
    return this.x;
  };

  p.sX = function (x) {
    this.x = x;
    this.e.style.left = x + 'px';
  };

  p.gY = function () {
    return this.y;
  };

  p.sB = function (bottom) {
    this.e.style.bottom = bottom + 'px';
  };

  p.sY = function (y) {
    this.y = y;
    this.e.style.top = y + 'px';
  };

  p.gW = function () {
    return this.w;
  };

  p.sW = function (width) {
    this.w = width;
    this.e.style.width = width + 'px';
  };

  p.gH = function () {
    return this.h;
  };

  p.sH = function (height) {
    this.h = height;
    this.e.style.height = height + 'px';
  };

  p.sS = function (scaleX, scaleY) {
    this.e.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
  };

  p.add = function (childElem) {
    this.e.appendChild(childElem.e);
  };

  p.sC = function (addClass) {
    this.e.classList.add(addClass);
  };

  p.tC = function (addClass, removeClass) {
    this.e.classList.add(addClass);
    this.e.classList.remove(removeClass);
  };

  p.rC = function (removeClass) {
    this.e.classList.remove(removeClass);
  };

  p.sT = function (text) {
    this.e.innerText = text;
  };

  p.onDown = function (handler) {
    this.e.addEventListener('mousedown', handler);
    this.e.addEventListener('touchstart', handler);
  };

  p.onUp = function (handler) {
    this.e.addEventListener('mouseup', handler);
    this.e.addEventListener('touchend', handler);
  };

  p.sO = function (opacity) {
    this.o = opacity;
    this.e.style.opacity = opacity;
  };

  return E;
}());

window.addEventListener('load', function () {
  var chart, charts = [];
  var names = ['Followers', 'Interactions', 'Messages', 'Views', 'Apps'];

  for (var i = 0; i < 5; i++) {
    chart = app.Chart(app.contest[i], i, names[i]);
    chart.setMode(false, '#ffffff');
    chart.onOverMode();
    charts.push(chart);
  }

  onResize();
  window.addEventListener('resize', onResize);

  function onResize() {
    var offset = 25;
    var sc = Math.min(1, window.innerWidth / (400 + offset * 2));

    for (var i = 0, l = charts.length; i < l; i++) {
      chart = charts[i];
      chart.view.sX(offset * sc);
      chart.view.sY((20 + 560 * i) * sc);
      chart.view.sS(sc, sc);
      chart.view.sc = sc;
    }
  }

  function setMode(isNight) {
    var bgColor = isNight ? '#242F3E' : '#ffffff';
    document.body.style.backgroundColor = bgColor;

    for (var i = 0; i < 5; i++) {
      charts[i].setMode(isNight, bgColor);
    }
  }

  setTimeout(setMode, 1000, true);
});

app.format = function (number) {
  if (number === 0) return 0;

  var s = '';

  if (number > 1000000000) {
    number *= 0.000000001;
    s = 'B';
  } else if (number > 1000000) {
    number *= 0.000001;
    s = 'M';
  } else if (number > 1000) {
    number *= 0.001;
    s = 'K';
  }

  return number.toFixed(number >= 10 ? 0 : 1) + s;
};

app.round = function round(num, func) {
  var l = String(num).length - 2;
  var n = '1';

  for (var i = 0; i < l; i++) {
    n += '0';
  }

  n = Number(n);
  return Math[func](num / n) * n;
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

app.getScrollY = app.supportPageOffset ? function () {
  return window.pageYOffset;
} : app.isCSS1Compat ? function () {
  return document.documentElement.scrollTop;
} : function () {
  return document.body.scrollTop;
};
