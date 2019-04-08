;app.Buttons = function (data, parent, cb) {
  var names = [], colors = [];

  data.columns.slice(1).forEach(function (col) {
    names.push(data.names[col[0]]);
    colors.push(data.colors[col[0]]);
  });

  var buttons = names.map(function (name, i) {
    var elem = new app.E('div');
    elem.sX(10 * i);
    elem.sY(450);
    elem.e.style.backgroundColor = colors[i];
    elem.e.style.position = 'relative';
    elem.sC('button');
    parent.add(elem);

    var tick = new app.E('img');
    tick.e.style.position = 'relative';
    tick.e.float = 'left';
    tick.e.src = 'img/tick.png';
    tick.e.height = 14;
    tick.sC('tween');
    elem.add(tick);

    var text = new app.E('span');
    text.e.style.margin = '10px';
    text.e.style.position = 'relative';
    text.sT(name);
    elem.add(text);

    elem.isActive = true;
    elem.tick = tick;

    function swap() {
      for (var i = 0, l = buttons.length; i < l; i++) {
        if (buttons[i] === elem) continue;
        buttons[i].isActive = !buttons[i].isActive;
        var s = buttons[i].isActive ? 1 : 0;
        buttons[i].tick.sS(s, s);

        cb(buttons);
      }
    }

    elem.onDown(function () {
      var time = Date.now();
      var timeout = setTimeout(swap, 200);
      app.i.upHandlers.push(onUp);

      function onUp() {
        app.i.upHandlers.splice(app.i.upHandlers.indexOf(onUp, 1));

        if (Date.now() - time > 200) return;
        clearTimeout(timeout);

        elem.isActive = !elem.isActive;
        var s = elem.isActive ? 1 : 0;
        tick.sS(s, s);

        cb(buttons);
      }
    });

    return elem;
  });

  return buttons;
};
