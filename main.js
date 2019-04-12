;window.addEventListener('load', function () {
  var chart, charts = [];

  for (var i = 0; i < 1; i++) {
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

    for (var i = 0; i < 1; i++) {
      chart = charts[i];
      chart.view.sX(offset * sc);
      chart.view.sY((20 + 560 * i) * sc);
      chart.view.sS(sc, sc);
      chart.view.sc = sc;
      charts.push(chart);
    }
  }
});
