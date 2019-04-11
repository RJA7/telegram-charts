;app.AxisX = function (parent) {
  var elems = [], prevLeftIndex, prevScaleX;
  var hash = {}, oldHash, colX, texts;
  app.months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var view = new app.E('div');
  view.sY(250);
  parent.add(view);

  function createElem() {
    var elem = new app.E('div');
    elem.sT(0);
    elem.sW(50);
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
