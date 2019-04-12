;window.addEventListener('load', function () {
  var chart, charts = [];

  for (var i = 0; i < 3; i++) {
    chart = app.Chart(app.contest[i]);
    charts.push(chart);
  }

  onResize();
  window.addEventListener('resize', onResize);

  (function update() {
    requestAnimationFrame(update);

    for (var i = 0, l = charts.length; i < l; i++) {
      charts[i].update();
    }
  }());

  function onResize() {
    var offset = 25;
    var sc = Math.min(1, window.innerWidth / (400 + offset * 2));

    for (var i = 0, l = charts.length; i < l; i++) {
      chart = charts[i];
      chart.view.sX(offset * sc);
      chart.view.sY((20 + 560 * i) * sc);
      chart.view.sS(sc, sc);
      chart.view.sc = sc;
      charts.push(chart);
    }
  }
});

app.formatNumber = function (n, short) {
  var abs = Math.abs(n);
  if (abs > 1000000000 && short) return (n / 1000000000).toFixed(2) + 'B';
  if (abs > 1000000 && short) return (n / 1000000).toFixed(2) + 'M';
  if (abs > 1000 && short) return (n / 1000).toFixed(1) + 'K';

  if (abs > 1) {
    var s = abs.toFixed(0);
    var formatted = n < 0 ? '-' : '';
    for (var i = 0; i < s.length; i++) {
      formatted += s.charAt(i);
      if ((s.length - 1 - i) % 3 === 0) formatted += ' ';
    }
    return formatted;
  }

  return n.toString()
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

app.getscrollY = app.supportPageOffset ? function () {
  return window.pageYOffset;
} : app.isCSS1Compat ? function () {
  return document.documentElement.scrollTop;
} : function () {
  return document.body.scrollTop;
};
