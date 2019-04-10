;app.AxisX = function (parent) {
  app.months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var elems = [];
  var elemsToStartTransition = [];

  function createElem() {
    var elem = new app.E('div');
    elem.sT(0);
    elem.sC('axis-x');
    parent.add(elem);

    return elem;
  }

  var hash = {}, oldHash, colX, texts;

  function clearHash() {
    for (var key in hash) {
      elems.push(hash[key]);
      hash[key].sO(0);
    }

    hash = {};
  }

  function delayCall() {
    var e;
    while (elemsToStartTransition.length !== 0) {
      e = elemsToStartTransition.pop();
      e.sC('tw');
      e.rC('tw-o');
    }
  }

  return {
    setOver: function (overview) {
      clearHash();
      colX = overview.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time);
        return date.getUTCDate() + ' ' + app.months[date.getUTCMonth()];
      });
    },

    setDat: function (dat) {
      clearHash();
      colX = dat.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time),
          hours = date.getUTCHours(),
          mins = date.getUTCMinutes();

        return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
      });
    },

    render: function (leftIndex, rightIndex, minX, sx) {
      var desStep = Math.ceil((rightIndex - leftIndex) / 7),
        step = 1, i, key;

      while (step < desStep) step *= 2;

      oldHash = hash;
      hash = {};

      for (i = leftIndex; i < rightIndex; i += step) {
        var elem = oldHash[i];

        if (!elem) {
          elem = elems.pop() || createElem();
          elem.rC('tw');
          elem.sC('tw-o');
          elemsToStartTransition.push(elem);
        }

        hash[i] = elem;
        elem.sT(texts[i]);
        elem.posX = colX[i];
        elem.sX((elem.posX - minX) * sx);
        elem.o === 0 && elem.sO(1);
      }

      for (key in oldHash) {
        if (!hash[key]) {
          elems.push(oldHash[key]);
          oldHash[key].sO(0);
          oldHash[key].sX(-(elem.posX - minX) * sx);
        }
      }

      setTimeout(delayCall, 0.2);
    }
  }
};
