;app.Buttons = function (parent, cb) {
  var buttons, self;

  self = {
    setOver: function (overview) {
      !buttons && reset(overview);
    },

    setDat: function (dat) {

    },

    views: null
  };

  function reset(dat) {
    var names = [], colors = [];

    if (buttons) {
      // todo destroy or reuse
    }

    dat.columns.slice(1).forEach(function (col) {
      names.push(dat.names[col[0]]);
      colors.push(dat.colors[col[0]]);
    });

    buttons = names.map(function (name, i) {
      var button, tick, text, timeout, downTime;

      button = new app.E('div');
      button.name = name;
      button.color = colors[i];
      button.sX(0);
      button.sY(450);
      button.e.style.backgroundColor = colors[i];
      button.sC('button');
      parent.add(button);

      tick = new app.E('img');
      tick.e.src = 'img/tick.png';
      tick.sC('tween');
      tick.sC('tick');
      button.add(tick);

      text = new app.E('span');
      text.sC('button-text');
      text.sT(name);
      button.add(text);

      button.isActive = true;
      button.tick = tick;

      function switchAllBeside(btn) {
        var i, s, l;
        btn.isDown = false;

        for (i = 0, l = buttons.length; i < l; i++) {
          btn = buttons[i];

          if (btn === button) continue;

          btn.isActive = !btn.isActive;
          s = btn.isActive ? 1 : 0;
          btn.tick.sS(s, s);
        }

        cb(buttons);
      }

      button.onDown(function () {
        button.isDown = true;
        downTime = Date.now();
        timeout = setTimeout(function () {
          switchAllBeside(button);
        }, 200);
      });

      button.onUp(function onUp() {
        if (!button.isDown || Date.now() - downTime > 200) return;
        button.isDown = false;

        clearTimeout(timeout);
        button.isActive = !button.isActive;

        var s = button.isActive ? 1 : 0;
        tick.sS(s, s);

        cb(buttons);
      });

      return button;
    });

    self.views = buttons;
  }

  return self;
};
