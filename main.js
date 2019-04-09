;window.addEventListener('load', function () {
  var view;

  for (var i = 0; i < 5; i++) {
    view = app.Chart(app.contest[i]);
    view.sX(30);
    view.sY(20 + 560 * i);
    view.e.style.margin = 'auto';
  }
});
