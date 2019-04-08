;app.Header = function (parent, cb) {
  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var title = new app.E('div');
  title.sT('Statistic');
  title.sC('tween');
  title.sC('title');
  title.sY(20);
  parent.add(title);

  var zoomOut = new app.E('div');
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

  var setRange = setRangeStandard;
  var rangeText = new app.E('div');
  rangeText.sY(20);
  rangeText.sC('range-text');
  parent.add(rangeText);

  function getDateStr(time) {
    var date = new Date(time);
    return date.getUTCDate() + ' ' + app.months[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  function getCloseDateStr(time) {
    var date = new Date(time);
    return days[date.getUTCDay()] + ', ' + date.getUTCDate() + ' ' +
      app.months[date.getUTCMonth()] + ' ' + date.getUTCFullYear();
  }

  function align() {
    rangeText.sX(400 - rangeText.e.getBoundingClientRect().width);
  }

  function setRangeStandard(firstIndex, lastIndex, data) {
    var start = getDateStr(data.columns[0][firstIndex + 1]);
    var end = getDateStr(data.columns[0][lastIndex + 1]);

    rangeText.sT(start === end ? start : start + ' - ' + end);
    align();
  }

  function setRangeClose(firstIndex, lastIndex, t, data) {
    var start = getCloseDateStr(data.columns[0][firstIndex + 1]);
    var end = getCloseDateStr(data.columns[0][lastIndex + 1]);

    rangeText.sT(start === end ? start : start + ' - ' + end);
    align();
  }

  return {
    standardMode: function () {
      zoomOut.inputEnabled = false;
      title.sS(1, 1);
      zoomOut.sS(1, 0);
      setRange = setRangeStandard;
    },

    closeMode: function () {
      zoomOut.inputEnabled = true;
      title.sS(1, 0);
      zoomOut.sS(1, 1);
      setRange = setRangeClose;
    },

    setRange: function (firstIndex, lastIndex, dataSd, dataCs) {
      setRange(firstIndex, lastIndex, dataSd, dataCs);
    }
  }
};
