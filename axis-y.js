;app.AxisY = function (parent, isRight) {
  var texts = [],
    length = 10,
    i, text;

  for (i = 0; i < length; i++) {
    text = new app.E('div');
    text.sC('axis-y');
    text.sC('tween');
    parent.add(text);
    texts.push(text);
  }

  return {
    render: function (minY, sy, offset) {
      var text, i, y;

      if (minY === undefined) {
        for (i = 0; i < length; i++) {
          texts[i].sO(0);
        }

        return;
      }

      for (i = 0; i < length; i++) {
        y = offset * i * sy;
        text = texts[i];
        text.e.style.bottom = y + 'px';
        text.sT(formatNumber(minY + offset * i, true));
        text.sO(1);

        if (isRight) {
          text.sX(400 - text.e.getBoundingClientRect().width);
        }

        if (y > 280) {
          text.o !== 0 && text.sO(0);
        } else {
          text.o === 0 && text.sO(1);
        }
      }
    }
  }
};

function formatNumber(n, short) {
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
}
