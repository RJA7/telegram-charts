;window.addEventListener('load', function () {
  var chart, charts = [];

  for (var i = 4; i < 5; i++) {
    chart = app.Chart(app.contest[i]);
    chart.view.sX(30);
    chart.view.sY(20 + 560 * i);
    chart.view.e.style.margin = 'auto';
    charts.push(chart);
  }

  (function update() {
    requestAnimationFrame(update);

    for (var i = 0, l = charts.length; i < l; i++) {
      charts[i].update();
    }
  }());
});
