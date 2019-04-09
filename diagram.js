;app.Diagram = function (width, height, buttons, hLines) {
  var colX, colors, cols, yScaled, stacked, types, draw, x, y;
  var view = new app.E('div'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d', {alpha: false});
  canvas.width = width;
  canvas.height = height;
  canvas.style.transform = 'scale(1, -1)';
  view.e.appendChild(canvas);

  hLines && hLines.addTo(view);

  function percentageDraw(x, y, scaleX, scaleY, col, stack, i, j, minimalX, minimalY) {
    ctx.lineTo((colX[j] - minimalX) * scaleX, (stack[j] - minimalY) * scaleY);
    stack[j] -= col[j];
  }

  function stackedDraw(x, y, scaleX, scaleY, col, stack, i, j, minimalX, minimalY) {
    y = (stack[j] - minimalY) * scaleY;
    stack[j] -= col[j];
    ctx.lineTo(x, y);
    x = (colX[j + 1] - minimalX) * scaleX;
    ctx.lineTo(x, y);
  }

  function reset(dat) {
    colX = dat.columns[0].slice(1);
    types = dat.types;
    yScaled = dat.y_scaled;
    stacked = dat.stacked || types.y0 === 'bar';
    colors = [];
    draw = dat.percentage ? percentageDraw : stackedDraw;

    cols = dat.columns.slice(1).map(function (col) {
      colors.push(dat.colors[col[0]]);
      col = col.slice(1);

      return col;
    });
  }

  return {
    canvas: canvas,
    view: view,

    setOver: function (overview) {
      reset(overview);
    },

    setDat: function (dat) {
      reset(dat);
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {
      var steps = 5,
        minimalX = colX[leftIndex],
        maximalX = colX[rightIndex],
        minimalY = Number.MAX_VALUE,
        maximalY = -Number.MAX_VALUE,
        col, i, j, l, jLen, scaleX, scaleY, offsetY, offsetsY, scalesY, minimalsY, minY, maxY, sy, my;

      for (i = 0, l = cols.length; i < l; i++) {
        if (!buttons.views[i].isActive) continue;
        col = cols[i];

        for (j = leftIndex, jLen = Math.min(rightIndex + 1, col.length); j < jLen; j++) {
          minimalY = Math.min(minimalY, col[j]);
          maximalY = Math.max(maximalY, col[j]);
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (minimalY === Number.MAX_VALUE) return;

      scaleX = width / (maximalX - minimalX);

      if (stacked) {
        var stack = [];

        for (j = leftIndex; j < jLen; j++) {
          stack[j] = 0;
        }

        for (i = 0, l = cols.length; i < l; i++) {
          if (!buttons.views[i].isActive) continue;

          for (j = leftIndex; j < jLen; j++) {
            stack[j] += cols[i][j];
          }
        }

        for (j = leftIndex; j < jLen; j++) {
          maximalY = Math.max(maximalY, stack[j]);
        }

        minimalY = 0;
        maximalY = round(maximalY);
        offsetY = Math.max(1, Math.floor(maximalY / steps));
        scaleY = height / maximalY;

        for (i = cols.length - 1; i >= 0; i--) {
          if (!buttons.views[i].isActive) continue;
          col = cols[i];

          ctx.beginPath();
          ctx.moveTo(0, 0);

          for (j = leftIndex; j < jLen; j++) {
            draw(x, y, scaleX, scaleY, col, stack, i, j, minimalX, minimalY);
          }

          ctx.lineTo(canvas.width, 0);
          ctx.lineTo(0, 0);
          ctx.closePath();

          ctx.fillStyle = colors[i];
          ctx.fill();
        }

      } else {

        if (minimalY === maximalY) minimalY = 0;

        offsetY = Math.max(1, Math.floor((maximalY - minimalY) / steps));
        scaleY = height / (maximalY - minimalY);

        if (yScaled) {
          offsetsY = [];
          scalesY = [];
          minimalsY = [];

          for (i = 0, l = cols.length; i < l; i++) {
            if (!buttons.views[i].isActive) continue;
            col = cols[i];
            minY = Number.MAX_VALUE;
            maxY = -Number.MAX_VALUE;

            for (j = leftIndex, jLen = Math.min(rightIndex + 1, col.length); j < jLen; j++) {
              minY = Math.min(minY, col[j]);
              maxY = Math.max(maxY, col[j]);
            }

            var offset = round(Math.max(1, Math.floor((maxY - minY) / steps)));
            offsetsY[i] = offset;
            scalesY[i] = offsetY / offset * scaleY;
            minimalsY[i] = minY;
          }
        }

        for (i = 0, l = cols.length; i < l; i++) {
          if (!buttons.views[i].isActive) continue;
          col = cols[i];

          if (yScaled) {
            sy = scalesY[i];
            my = minimalsY[i];
          } else {
            sy = scaleY;
            my = minimalY;
          }

          ctx.beginPath();
          ctx.moveTo((colX[leftIndex] - minimalX) * scaleX, (col[leftIndex] - my) * sy);

          for (j = leftIndex + 1; j < jLen; j++) {
            ctx.lineTo((colX[j] - minimalX) * scaleX, (col[j] - my) * sy);
          }

          ctx.strokeStyle = colors[i];
          ctx.stroke();
        }
      }

      axisX && axisX.render(leftIndex, rightIndex, minimalX, scaleX);
      hLines && hLines.render(minimalY, scaleY, offsetY);

      if (axesY) {
        if (yScaled) {
          for (i = 0, l = axesY.length; i < l; i++) {
            axesY[i].render(minimalsY[i], scalesY[i], offsetsY[i]);
          }
        } else {
          axesY[0].render(minimalY, scaleY, offsetY);
        }
      }
    }
  }
};

function round(num) {
  var l = String(num).length - 2;
  var n = '1';

  for (var i = 0; i < l; i++) {
    n += '0';
  }

  n = Number(n);
  return Math.ceil(num / n) * n;
}
