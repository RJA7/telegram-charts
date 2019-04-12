app.HLines = function (axesLen) {
  var lines = [], line, hash = {}, oldHash, prevMainMinY, prevScaleY;

  var view = new app.E('div');
  view.sY(250);

  function createLine() {
    var line = new app.E('div');
    line.sW(400);
    line.sH(1);
    line.sC('axis-line');
    line.texts = [];
    view.add(line);

    for (var i = 0, text; i < axesLen; i++) {
      text = new app.E('div');
      if (i === 1) {
        text.e.style.right = 0 + 'px';
      }
      text.sY(-16);
      line.add(text);
      line.texts.push(text);
    }

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

  function reset() {
    prevScaleY = 1;
    prevMainMinY = 0;

    for (var key in hash) {
      lines.push(hash[key]);
      hash[key].sO(0);
    }

    hash = {};
  }

  return {
    addTo: function (parent) {
      parent.add(view);
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

          for (j = 0; j < axesLen; j++) {
            text = line.texts[j];
            text.sT(app.formatNumber(offsetY[j] * i * scaleY[j], true));
          }

          line.index = y;
          line.sO(1);
          line.sB((y - prevMainMinY) * prevScaleY);
          setTimeout(addTween, 0, line, (y - mainMinY) * mainScaleY);
        } else {
          line.sB((y - mainMinY) * mainScaleY);
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
