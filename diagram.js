;app.Diagram = function (width, height, buttons, hLines, addReserve) {
  var colX, colors, cols, yScaled, stacked, types, draw, x, y,
    prevScaleX = 0, prevScaleY = [], prevMaxY = [],
    prevLeftIndex = -1, animate, steps = 5, colsLength,
    maxX, minX, scaleX,
    mainMinY = Number.MAX_VALUE,
    mainMaxY = -Number.MAX_VALUE,
    col, scaleY = [], offsetY = [], minY = [], maxY = [], render,
    canvases = [], canvasContainers = [], contexts = [], canvasContainer, canvas, ctx, canvasesLen,
    mainOffset, mainScaleY,
    canvasReserveX = addReserve ? 250 : 0;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  var overflow = new app.E('div');
  overflow.e.style.overflow = 'hidden';
  overflow.sW(width);
  overflow.sH(height);
  view.add(overflow);

  hLines && hLines.addTo(view);

  function init(dat) {
    reset(dat);
    init = reset;

    for (var i = 0; i < canvasesLen; i++) {
      canvasContainer = new app.E('div');
      overflow.add(canvasContainer);

      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d', {alpha: true});
      canvas.width = width + canvasReserveX * 2;
      canvas.height = height;
      canvas.style.transform = 'scale(1, -1)';
      canvas.style.height = height + 'px';
      canvas.style.position = 'absolute';
      canvasContainer.e.appendChild(canvas);

      canvases[i] = canvas;
      contexts[i] = ctx;
      canvasContainers[i] = canvasContainer;
    }

    if (!yScaled) {
      for (i = 1; i < colsLength; i++) {
        canvases[i] = canvases[0];
        contexts[i] = contexts[0];
        canvasContainers[i] = canvasContainers[0];
      }
    }
  }

  function reset(dat) {
    animate = false;
    colX = dat.columns[0].slice(1);
    types = dat.types;
    yScaled = dat.y_scaled;
    stacked = dat.stacked || types.y0 === 'bar';
    colors = [];

    cols = dat.columns.slice(1).map(function (col) {
      colors.push(dat.colors[col[0]]);
      col = col.slice(1);

      return col;
    });

    colsLength = cols.length;

    if (stacked) {
      render = renderStacked;
      draw = dat.percentage ? stackedLines : stackedBars;
    } else {
      render = renderLines;
    }

    canvasesLen = yScaled ? colsLength : 1;
    prevScaleX = width / (colX[colX.length - 1] - colX[0]);
  }

  function startAnimation() {
    animate = false;

    canvas.style.width = canvasReserveX * 2 + width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.top = 0 + 'px';
    canvas.style.left = 0 + 'px';
    canvas.classList.add('tween');
  }

  return {
    view: view,
    bgColor: '',

    setOver: function (overview) {
      init(overview);
    },

    setDat: function (dat) {
      init(dat);
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {
      var i;

      calcBounds(leftIndex, rightIndex);

      for (i = 0; i < canvasesLen; i++) {
        ctx = contexts[i];
        ctx.clearRect(0, 0, canvas.width, height);
      }

      if (mainMinY === Number.MAX_VALUE) return;

      axisX && axisX.render(leftIndex, rightIndex, scaleX);

      var reservedIndex = Math.ceil((rightIndex - leftIndex) * 0.5);
      rightIndex = Math.min(col.length - 1, rightIndex + reservedIndex);
      leftIndex = Math.max(0, leftIndex - reservedIndex);

      if (!animate) {
        animate = true;

        for (i = 0; i < canvasesLen; i++) {
          canvas = canvases[i];
          canvasContainer = canvasContainers[i];

          canvas.style.top = (prevMaxY[i] - maxY[i]) * prevScaleY[i] + 'px';
          canvas.style.height = (parseInt(canvas.style.height)) * prevScaleY[i] / scaleY[i] + 'px';

          canvas.style.width = (parseInt(canvas.style.width)) * prevScaleX / scaleX + 'px';
          canvas.classList.remove('tween');

          var canvasContainerX = canvasContainer.x;
          canvasContainer.sX((colX[leftIndex] - minX) * scaleX);
          canvas.style.left = canvasContainerX - canvasContainer.x + (colX[leftIndex] - colX[prevLeftIndex]) * prevScaleX + 'px';

          setTimeout(startAnimation, 0);
          prevScaleY[i] = scaleY[i];
          prevMaxY[i] = maxY[i];
        }
      }

      prevScaleX = scaleX;
      prevLeftIndex = leftIndex;

      minX = colX[leftIndex];
      maxX = colX[rightIndex];

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

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];
      ctx = contexts[i];

      ctx.beginPath();
      ctx.moveTo((colX[leftIndex] - minX) * scaleX, (col[leftIndex] - minY[i]) * scaleY[i]);

      for (j = leftIndex + 1; j <= rightIndex; j++) {
        ctx.lineTo((colX[j] - minX) * scaleX, (col[j] - minY[i]) * scaleY[i]);
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
      mainMaxY = Math.max(mainMaxY, stack[j]);
    }

    mainMinY = 0;
    // maximalY = round(maximalY);
    offsetY = Math.max(1, Math.floor(mainMaxY / steps));
    scaleY = height / mainMaxY;

    for (i = cols.length - 1; i >= 0; i--) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];

      x = (colX[leftIndex] - minX) * scaleX;

      ctx.beginPath();
      ctx.moveTo(x, 0);

      for (j = leftIndex; j <= rightIndex; j++) {
        draw(x, col, stack, j);
      }

      ctx.lineTo((colX[rightIndex] - minX) * scaleX, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }

  function stackedLines(x, col, stack, j) {
    ctx.lineTo((colX[j] - minX) * scaleX, (stack[j] - mainMinY) * scaleY);
    stack[j] -= col[j];
  }

  function stackedBars(x, col, stack, j) {
    y = (stack[j] - mainMinY) * scaleY;
    stack[j] -= col[j];
    ctx.lineTo(x, y);
    x = (colX[j + 1] - minX) * scaleX;
    ctx.lineTo(x, y);
  }

  function calcBounds(leftIndex, rightIndex) {
    var i, j;
    minX = colX[leftIndex];
    maxX = colX[rightIndex];
    mainMinY = Number.MAX_VALUE;
    mainMaxY = -Number.MAX_VALUE;
    scaleX = width / (maxX - minX);

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];
      minY[i] = Number.MAX_VALUE;
      maxY[i] = -Number.MAX_VALUE;

      for (j = leftIndex; j <= rightIndex; j++) {
        minY[i] = Math.min(minY[i], col[j]);
        maxY[i] = Math.max(maxY[i], col[j]);
      }

      offsetY[i] = Math.max(1, Math.floor((maxY[i] - minY[i]) / steps));
      mainMaxY = Math.max(maxY[i], mainMaxY);
      mainMinY = Math.min(minY[i], mainMinY);
    }

    mainMinY = mainMinY === mainMaxY ? 0 : mainMinY;
    mainOffset = Math.max(1, Math.floor((mainMaxY - mainMinY) / steps));
    mainScaleY = height / (mainMaxY - mainMinY);

    if (yScaled) {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY * offsetY[i] / mainOffset;
      }
    } else {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY;
        minY[i] = mainMinY;
        maxY[i] = mainMaxY;
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
