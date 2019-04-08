;app.AxisY = function (parent, showLines) {
  var elems = [];
  var texts = [];
  var length = 10;

  for (var i = 0; i < length; i++) {
    var elem = new app.E('div');
    elem.sW(400);
    elem.sH(1);
    showLines && elem.sC('axis-line');
    parent.add(elem);

    var text = new app.E('div');
    text.sC('axis-y-text');
    text.sC('tween');
    text.sY(-16);
    elem.add(text);

    elems.push(elem);
    texts.push(text);
  }

  elems[0].sH(2);

  return {
    render: function (minY, sy, offset) {
      for (var i = 0, elem; i < length; i++) {
        if (minY === undefined) {
          texts[i].sO(0);
          continue;
        } else {
          texts[i].sO(1);
        }

        var y = offset * i * sy;
        elem = elems[i];
        elem.e.style.bottom = y + 'px';
        texts[i].sT(minY + offset * i);

        if (!showLines) {
          elem.sX(400 - texts[i].e.getBoundingClientRect().width);
        }

        if (y > 280) {
          elem.o !== 0 && elem.sO(0);
        } else {
          elem.o === 0 && elem.sO(1);
        }
      }
    }
  }
};
