;app.Header = function (parent, cb) {
  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    getDateStr = getDateStrOver,
    title, zoomOut, data, rangeText;

  title = new app.E('div');
  title.sT('Statistic');
  title.sC('tween');
  title.sC('title');
  title.sY(20);
  parent.add(title);

  zoomOut = new app.E('div');
  zoomOut.sC('zoom');
  zoomOut.sY(20);
  zoomOut.sT('Zoom Out');
  zoomOut.sS(1, 0);
  zoomOut.sC('tween');
  zoomOut.inputEnabled = false;
  parent.add(zoomOut);

  zoomOut.onDown(function () {
    zoomOut.inputEnabled && cb();
  });

  rangeText = new app.E('div');
  rangeText.sY(20);
  rangeText.sC('range-text');
  parent.add(rangeText);

  function getDateStrOver(time) {
    var date = new Date(time);
    return date.getUTCDate() + ' ' + app.months[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  function getDateStrDat(time) {
    var date = new Date(time);
    return days[date.getUTCDay()] + ', ' + date.getUTCDate() + ' ' +
      app.months[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  return {
    setOver: function (overview) {
      data = overview;
      zoomOut.inputEnabled = false;
      title.sS(1, 1);
      zoomOut.sS(1, 0);
      getDateStr = getDateStrOver;
    },

    setDat: function (dat) {
      data = dat;
      zoomOut.inputEnabled = true;
      title.sS(1, 0);
      zoomOut.sS(1, 1);
      getDateStr = getDateStrDat;
    },

    setRange: function (leftIndex, rightIndex) {
      var start = getDateStr(data.columns[0][leftIndex + 1]);
      var end = getDateStr(data.columns[0][rightIndex + 1]);

      rangeText.sT(start === end ? start : start + ' - ' + end);
      rangeText.sX(400 - rangeText.e.getBoundingClientRect().width);
    }
  }
};
