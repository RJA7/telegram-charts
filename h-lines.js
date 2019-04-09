app.HLines = function () {
  var lines = [],
    length = 10,
    i, line;

  for (i = 0; i < length; i++) {
    line = new app.E('div');
    line.sW(400);
    line.sH(1);
    line.sC('axis-line');
    lines.push(line);
  }

  lines[0].sH(2);

  return {
    addTo: function (parent) {
      for (var i = 0; i < length; i++) {
        parent.add(lines[i]);
      }
    },

    render: function (minY, sy, offset) {
      if (minY === undefined) return;

      var y, line;

      for (i = 0; i < length; i++) {
        y = offset * i * sy;
        line = lines[i];
        line.e.style.bottom = y + 'px';

        if (y > 280) {
          line.o !== 0 && line.sO(0);
        } else {
          line.o === 0 && line.sO(1);
        }
      }
    }
  }
};
