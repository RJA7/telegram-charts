;app.AxisX = function (parent) {
  app.months = ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var elems = [];

  function createElem() {
    var elem = new app.E('div');
    elem.sT(0);
    elem.sC('axis-x');
    parent.add(elem);

    return elem;
  }

  var hash = {};
  var oldHash, colX, texts;

  function clearHash() {
    for (var key in hash) {
      elems.push(hash[key]);
      hash[key].sO(0);
    }

    hash = {};
  }

  return {
    setCloseData: function (data) {
      clearHash();
      colX = data.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time);
        var hours = date.getUTCHours();
        var mins = date.getUTCMinutes();
        return (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;
      });
    },

    setStandardData: function (data) {
      clearHash();
      colX = data.columns[0].slice(1);

      texts = colX.map(function (time) {
        var date = new Date(time);
        return date.getUTCDate() + ' ' + app.months[date.getUTCMonth()];
      });
    },

    render: function (firstIndex, lastIndex, minX, sx) {
      var desStep = Math.ceil((lastIndex - firstIndex) / 7);
      var step = 1;
      while (step < desStep) step *= 2;

      oldHash = hash;
      hash = {};

      for (var i = Math.ceil(firstIndex / step) * step, n = 0; i < lastIndex; i += step, n++) {
        var elem = oldHash[i] || elems.pop() || createElem();
        hash[i] = elem;
        elem.sT(texts[i]);
        elem.sX((colX[i] - minX) * sx);
        elem.sO(1);
      }

      for (var key in oldHash) {
        if (!hash[key]) {
          elems.push(oldHash[key]);
          oldHash[key].sO(0);
        }
      }
    }
  }
};
