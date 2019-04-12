;app.Buttons = function (parent, isSingle, cb) {
  var buttons, view;

  view = new app.E('div');
  view.sY(450);
  parent.add(view);

  function init(dat) {
    var names = [], colors = [];

    dat.columns.slice(1).forEach(function (col) {
      names.push(dat.names[col[0]]);
      colors.push(dat.colors[col[0]]);
    });

    buttons = names.map(function (name, i) {
      var button, tick, text, timeout, downTime;

      button = new app.E('div');
      button.name = name;
      button.color = colors[i];
      button.e.style.backgroundColor = colors[i];
      button.sC('button');
      view.add(button);

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
      button.text = text;

      function turnOffAllBeside(btn) {
        var i, s, l;
        btn.isDown = false;

        for (i = 0, l = buttons.length; i < l; i++) {
          btn = buttons[i];
          btn.isActive = btn === button;
          s = btn.isActive ? 1 : 0;
          btn.tick.sS(s, s);
        }

        cb(buttons);
      }

      button.onDown(function () {
        button.isDown = true;
        downTime = Date.now();
        timeout = setTimeout(function () {
          turnOffAllBeside(button);
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
  }

  return {
    setOver: function (dat) {
      !buttons && init(dat);

      if (isSingle) {
        this.views = [{isActive: true, name: dat.names.y0}];
        view.sO(0);
      } else {
        this.views = buttons;
      }
    },

    setDat: function (dat) {
      view.sO(1);
      this.views = buttons;

      if (isSingle) {
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].name = dat.names[dat.columns[i + 1][0]];
          buttons[i].text.sT(buttons[i].name);
        }
      }
    },

    views: null
  };
};
