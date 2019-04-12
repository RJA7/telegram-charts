;window.addEventListener('load', function () {
  var chart, charts = [];

  for (var i = 3; i < 4; i++) {
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

app.getscrollY = app.supportPageOffset ? function () {
  return window.pageYOffset;
} : app.isCSS1Compat ? function () {
  return document.documentElement.scrollTop;
} : function () {
  return document.body.scrollTop;
};
