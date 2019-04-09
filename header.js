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

  function getDateStrOver(leftTime, rightTime) {
    var leftDate = new Date(leftTime);
    var rightDate = new Date(rightTime);
    var res = leftDate.getUTCDate() + ' ' + app.months[leftDate.getUTCMonth()] + ' ' + leftDate.getUTCFullYear();
    var leftPlus = new Date(leftTime);
    leftPlus.setUTCMonth(leftDate.getUTCMonth() + 1);

    if (leftPlus.getTime() !== rightDate.getTime()) {
      res += ' - ' + rightDate.getUTCDate() + ' ' + app.months[rightDate.getUTCMonth()] + ' ' + rightDate.getUTCFullYear();
    }

    return res;
  }

  function getDateStrDat(leftTime, rightTime) {
    var leftDate = new Date(leftTime);
    var rightDate = new Date(rightTime);
    var res = days[leftDate.getUTCDay()] + ', ' + leftDate.getUTCDate() + ' ' +
      app.months[leftDate.getUTCMonth()] + ' ' + leftDate.getUTCFullYear();
    var leftPlus = new Date(leftTime);
    leftPlus.setUTCDate(leftDate.getUTCDate() + 1);

    if (leftPlus.getTime() !== rightDate.getTime()) {
      res += days[rightDate.getUTCDay()] + ', ' + rightDate.getUTCDate() + ' ' +
        app.months[rightDate.getUTCMonth()] + ' ' + rightDate.getUTCFullYear();
    }

    return res;
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
      rangeText.sT(getDateStr(data.columns[0][leftIndex + 1], data.columns[0][rightIndex + 1]));
      rangeText.sX(400 - rangeText.e.getBoundingClientRect().width);
    }
  }
};
