;app.Diagram = function (width, height) {
  var view = new app.E('div');

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d', {alpha: false});
  canvas.width = width;
  canvas.height = height;
  canvas.style.transform = 'scale(1, -1)';
  view.e.appendChild(canvas);

  var colX, colors, cols, yScaled, stacked;

  return {
    canvas: canvas,
    view: view,

    setData: function (data) {
      colX = data.columns.slice()[0].slice(1);
      colors = [];
      yScaled = data.y_scaled;
      stacked = data.stacked;

      cols = data.columns.slice(1).map(function (col) {
        colors.push(data.colors[col[0]]);
        col = col.slice(1);
        return col;
      });
    },

    render: function (startIndex, endIndex, buttons, axisX, axesY) {
      var minX = colX[startIndex],
        maxX = colX[endIndex],
        minY = Number.MAX_VALUE,
        maxY = -Number.MAX_VALUE,
        col, i, j, l, jLen, sx, sy;

      for (i = 0, l = cols.length; i < l; i++) {
        if (!buttons[i].isActive) continue;
        col = cols[i];

        for (j = startIndex, jLen = Math.min(endIndex + 1, col.length); j < jLen; j++) {
          minY = Math.min(minY, col[j]);
          maxY = Math.max(maxY, col[j]);
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      if (minY === Number.MAX_VALUE) return;

      if (minY === maxY || stacked) minY = 0;

      var steps = 5;
      var offsetY = Math.max(1, Math.floor((maxY - minY) / steps));
      // offsetY = abbreviateNumber(offsetY)

      sx = width / (maxX - minX);
      sy = height / (maxY - minY);

      if (yScaled) {
        var offsets = [], ssy = [], minYs = [];

        for (i = 0, l = cols.length; i < l; i++) {
          if (!buttons[i].isActive) continue;
          col = cols[i];
          minY = Number.MAX_VALUE;
          maxY = -Number.MAX_VALUE;

          for (j = startIndex, jLen = Math.min(endIndex + 1, col.length); j < jLen; j++) {
            minY = Math.min(minY, col[j]);
            maxY = Math.max(maxY, col[j]);
          }

          var offset = Math.max(1, Math.floor((maxY - minY) / steps));
          offsets[i] = offset;
          ssy[i] = offsetY / offset * sy;
          minYs[i] = minY;
        }
      }

      if (stacked) {
        var stack = [];

        for (i = 0, l = cols.length; i < l; i++) {
          stack[i] = [];

          for (j = startIndex + 1; j < jLen; j++) {
            stack[i][j] = (stack[i][j - 1] || 0) + col[j] * sy;
          }
        }

        for (i = 0, l = cols.length; i < l; i++) {
          if (!buttons[i].isActive) continue;
          col = cols[i];

          ctx.beginPath();
          ctx.moveTo((colX[startIndex] - minX) * sx, (col[startIndex] - minY) * sy + stack[i]);

          for (j = startIndex + 1; j < jLen; j++) {
            ctx.lineTo((colX[j] - minX) * sx, (col[j] - minY) * sy);
          }

          ctx.strokeStyle = colors[i];
          ctx.stroke();
        }
      } else {
        for (i = 0, l = cols.length; i < l; i++) {
          if (!buttons[i].isActive) continue;
          col = cols[i];

          if (yScaled) {
            sy = ssy[i];
            minY = minYs[i];
          }

          ctx.beginPath();
          ctx.moveTo((colX[startIndex] - minX) * sx, (col[startIndex] - minY) * sy);

          for (j = startIndex + 1; j < jLen; j++) {
            ctx.lineTo((colX[j] - minX) * sx, (col[j] - minY) * sy);
          }

          ctx.strokeStyle = colors[i];
          ctx.stroke();
        }
      }

      if (axisX) {
        axisX.render(startIndex, endIndex, minX, sx);
      }

      if (axesY) {
        if (yScaled) {
          for (i = 0, l = axesY.length; i < l; i++) {
            axesY[i].render(minYs[i], ssy[i], offsets[i]);
          }
        } else {
          axesY[0].render(minY, sy, offsetY);
        }
      }
    }
  }
};
