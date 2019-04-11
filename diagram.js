;app.Diagram = function (width, height, buttons, hLines, addReserve) {
  var colX, colors, cols, yScaled, stacked, types, draw, x, y,
    prevScaleX = 0, prevScaleY, prevMinY, prevMaxY, prevMinX, prevMaxX,
    prevLeftIndex = -1, prevRightIndex, animate, minimalX, maximalX, steps = 5, colsLength,
    minimalY = Number.MAX_VALUE,
    maximalY = -Number.MAX_VALUE,
    col, scaleX, scaleY, offsetY, offsetsY, scalesY, minimalsY, minY, maxY, sy, my, render,
    canvasReserveX = addReserve ? 250 : 0;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  var overflow = new app.E('div');
  overflow.e.style.overflow = 'hidden';
  overflow.sW(width);
  overflow.sH(height);
  view.add(overflow);

  var canvasContainer = new app.E('div');
  overflow.add(canvasContainer);

  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d', {alpha: false});
  canvas.width = width + canvasReserveX * 2;
  canvas.height = height;
  canvas.style.transform = 'scale(1, -1)';
  canvas.style.height = height + 'px';
  canvas.style.position = 'absolute';
  canvasContainer.e.appendChild(canvas);

  hLines && hLines.addTo(view);

  function reset(dat) {
    animate = false;
    colX = dat.columns[0].slice(1);
    types = dat.types;
    yScaled = dat.y_scaled;
    stacked = dat.stacked || types.y0 === 'bar';
    colors = [];

    prevScaleX = width / (colX[colX.length - 1] - colX[0]);

    if (stacked) {
      render = renderStacked;
      draw = dat.percentage ? stackedLines : stackedBars;
    } else {
      render = renderLines;
    }

    cols = dat.columns.slice(1).map(function (col) {
      colors.push(dat.colors[col[0]]);
      col = col.slice(1);

      return col;
    });

    colsLength = cols.length;
  }

  return {
    canvas: canvas,
    view: view,
    bgColor: '',

    setOver: function (overview) {
      reset(overview);
    },

    setDat: function (dat) {
      reset(dat);
    },

    update: function () {
      if (animate) {
        animate = false;

        canvas.style.width = canvasReserveX * 2 + width + 'px';
        canvas.style.height = canvas.height + 'px';
        canvas.style.top = 0 + 'px';
        canvas.style.left = 0 + 'px';
        canvas.classList.add('tween');
      }
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {
      var i, j, l;
      minimalX = colX[leftIndex];
      maximalX = colX[rightIndex];
      minimalY = Number.MAX_VALUE;
      maximalY = -Number.MAX_VALUE;

      for (i = 0, l = cols.length; i < l; i++) {
        if (buttons.views[i] && !buttons.views[i].isActive) continue;
        col = cols[i];

        for (j = leftIndex; j <= rightIndex; j++) {
          minimalY = Math.min(minimalY, col[j]);
          maximalY = Math.max(maximalY, col[j]);
        }
      }

      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, canvas.width, height);

      if (minimalY === Number.MAX_VALUE) return;

      scaleX = width / (maximalX - minimalX);
      scaleY = height / (maximalY - minimalY);

      axisX && axisX.render(leftIndex, rightIndex, scaleX);

      var reservedIndex = Math.ceil((rightIndex - leftIndex) * 0.5);
      rightIndex = Math.min(col.length - 1, rightIndex + reservedIndex);
      leftIndex = Math.max(0, leftIndex - reservedIndex);

      if (!animate) {
        animate = true;

        canvas.style.top = ((prevMinY - minimalY) - (maximalY - prevMaxY) - 0.5) * prevScaleY + 'px';
        canvas.style.height = (parseInt(canvas.style.height)) * prevScaleY / scaleY + 'px';

        canvas.style.width = (parseInt(canvas.style.width)) * prevScaleX / scaleX + 'px';
        canvas.classList.remove('tween');
      }

      var canvasContainerX = canvasContainer.x;
      canvasContainer.sX((colX[leftIndex] - minimalX) * scaleX);
      canvas.style.left = canvasContainerX - canvasContainer.x + (colX[leftIndex] - colX[prevLeftIndex]) * prevScaleX + 'px';

      prevScaleX = scaleX;
      prevScaleY = scaleY;
      prevMinY = minimalY;
      prevMaxY = maximalY;
      prevMinX = minimalX;
      prevMaxX = maximalX;
      prevLeftIndex = leftIndex;
      prevRightIndex = rightIndex;

      minimalX = colX[leftIndex];
      maximalX = colX[rightIndex];

      render(leftIndex, rightIndex);


      // hLines && hLines.render(minimalY, scaleY, offsetY);
      //
      // if (axesY) {
      //   if (yScaled) {
      //     for (i = 0, l = axesY.length; i < l; i++) {
      //       axesY[i].render(minimalsY[i], scalesY[i], offsetsY[i]);
      //     }
      //   } else {
      //     axesY[0].render(minimalY, scaleY, offsetY);
      //   }
      // }
    }
  };

  function renderLines(leftIndex, rightIndex) {
    var i, j;

    if (minimalY === maximalY) minimalY = 0;

    offsetY = Math.max(1, Math.floor((maximalY - minimalY) / steps));

    if (yScaled) {
      offsetsY = [];
      scalesY = [];
      minimalsY = [];

      for (i = 0; i < colsLength; i++) {
        if (!buttons.views[i].isActive) continue;
        col = cols[i];
        minY = Number.MAX_VALUE;
        maxY = -Number.MAX_VALUE;

        for (j = leftIndex; j <= rightIndex; j++) {
          minY = Math.min(minY, col[j]);
          maxY = Math.max(maxY, col[j]);
        }

        var offset = Math.max(1, Math.floor((maxY - minY) / steps));
        // offset = round(offset);
        offsetsY[i] = offset;
        scalesY[i] = offsetY / offset * scaleY;
        minimalsY[i] = minY;
      }
    }

    for (i = 0; i < colsLength; i++) {
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

      for (j = leftIndex + 1; j <= rightIndex; j++) {
        ctx.lineTo((colX[j] - minimalX) * scaleX, (col[j] - my) * sy);
      }

      ctx.strokeStyle = colors[i];
      ctx.stroke();
    }
  }

  function renderStacked(leftIndex, rightIndex) {
    var stack = [], i, j, col;

    for (j = leftIndex; j <= rightIndex; j++) {
      stack[j] = 0;
    }

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;

      for (j = leftIndex; j <= rightIndex; j++) {
        stack[j] += cols[i][j];
      }
    }

    for (j = leftIndex; j <= rightIndex; j++) {
      maximalY = Math.max(maximalY, stack[j]);
    }

    minimalY = 0;
    // maximalY = round(maximalY);
    offsetY = Math.max(1, Math.floor(maximalY / steps));
    scaleY = height / maximalY;

    for (i = cols.length - 1; i >= 0; i--) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];

      x = (colX[leftIndex] - minimalX) * scaleX;

      ctx.beginPath();
      ctx.moveTo(x, 0);

      for (j = leftIndex; j <= rightIndex; j++) {
        draw(x, col, stack, j);
      }

      ctx.lineTo((colX[rightIndex] - minimalX) * scaleX, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }

  function stackedLines(x, col, stack, j) {
    ctx.lineTo((colX[j] - minimalX) * scaleX, (stack[j] - minimalY) * scaleY);
    stack[j] -= col[j];
  }

  function stackedBars(x, col, stack, j) {
    y = (stack[j] - minimalY) * scaleY;
    stack[j] -= col[j];
    ctx.lineTo(x, y);
    x = (colX[j + 1] - minimalX) * scaleX;
    ctx.lineTo(x, y);
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
