;app.Diagram = function (width, height, buttons, hLines, addReserve) {
  var colX, colors, cols, yScaled, stacked, types, draw,
    prevScaleX = 0, prevScaleY = [], prevMaxY = [],
    prevLeftIndex = -1, prevRightIndex, animate, steps = 5, colsLength,
    maxX, minX, scaleX,
    mainMinY = Number.MAX_VALUE,
    mainMaxY = -Number.MAX_VALUE,
    scaleY = [], offsetY = [], minY = [], maxY = [], render,
    canvases = [], canvasContainers = [], contexts = [], canvasContainer, canvas, ctx, canvasesLen,
    mainOffset, mainScaleY,
    stack = [],
    calcBounds,
    canvasReserveX = addReserve ? 400 : 0;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  var overflow = new app.E('div');
  overflow.e.style.overflow = 'hidden';
  overflow.sW(width);
  overflow.sH(height);
  view.add(overflow);

  var overlayLayer = new app.E('div');
  overlayLayer.sW(view.w);
  overlayLayer.sH(view.h);
  overlayLayer.sO(0);
  view.add(overlayLayer);

  hLines && hLines.addTo(view);

  function init(dat) {
    reset(dat);
    init = reset;

    for (var i = 0; i < canvasesLen; i++) {
      canvasContainer = new app.E('div');
      overflow.add(canvasContainer);

      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d', {alpha: canvasesLen !== 1});
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
      calcBounds = stackedCalcBounds;
    } else {
      render = renderLines;
      calcBounds = linesCalcBounds;
    }

    canvasesLen = yScaled ? colsLength : 1;
    prevScaleX = width / (colX[colX.length - 1] - colX[0]);
  }

  function startAnimation() {
    animate = false;

    for (var i = 0; i < canvasesLen; i++) {
      canvas = canvases[i];
      canvas.style.width = canvasReserveX * 2 + width + 'px';
      canvas.style.height = canvas.height + 'px';
      canvas.style.top = 0 + 'px';
      canvas.style.left = 0 + 'px';
      canvas.classList.add('tween');
    }
  }

  return {
    view: view,
    bgColor: '#ffffff',
    overlayLayer: overlayLayer,

    setOver: function (overview) {
      init(overview);
    },

    setDat: function (dat) {
      init(dat);
    },

    getY: function (colIndex, index) {
      return (cols[colIndex][index] - minY[colIndex]) * scaleY[colIndex];
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {
      var i, newLeftIndex, newRightIndex;

      var reservedIndex = Math.ceil((rightIndex - leftIndex));
      var reserveLeft, reserveRight;

      if (leftIndex !== prevLeftIndex && rightIndex !== prevRightIndex) {
        reserveLeft = 1;
        reserveRight = 1;
      } else if (leftIndex !== prevLeftIndex) {
        reserveLeft = 2;
        reserveRight = 0;
      } else {
        reserveLeft = 0;
        reserveRight = 2;
      }

      newLeftIndex = Math.max(0, leftIndex - Math.floor(reservedIndex * reserveLeft));
      newRightIndex = Math.min(colX.length - 1, rightIndex + Math.floor(reservedIndex * reserveRight));

      calcBounds(leftIndex, rightIndex, newLeftIndex, newRightIndex);

      contexts[0].fillStyle = this.bgColor;
      contexts[0].fillRect(0, 0, canvas.width, canvas.height);
      yScaled && contexts[1].clearRect(0, 0, canvas.width, canvas.height);

      if (mainMinY === Number.MAX_VALUE) return;

      axisX && axisX.render(leftIndex, rightIndex, scaleX);
      hLines && hLines.render(minY, scaleY, offsetY, mainMinY, mainScaleY, mainOffset, axesY);

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
          canvasContainer.sX((colX[newLeftIndex] - minX) * scaleX);
          canvas.style.left = canvasContainerX - canvasContainer.x +
            (colX[newLeftIndex] - colX[prevLeftIndex]) * prevScaleX + 'px';

          prevScaleY[i] = scaleY[i];
          prevMaxY[i] = maxY[i];
        }

        setTimeout(startAnimation, 0);
      }

      prevScaleX = scaleX;
      prevLeftIndex = newLeftIndex;
      prevRightIndex = newRightIndex;

      minX = colX[newLeftIndex];
      maxX = colX[newRightIndex];

      render(newLeftIndex, newRightIndex);
    }
  };

  function renderLines(leftIndex, rightIndex) {
    var i, j, col;

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];
      ctx = contexts[i] || contexts[0];

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
    var i, j, x, offsetX, col;
    offsetX = (colX[rightIndex] - minX) * scaleX / (rightIndex - leftIndex);

    for (i = cols.length - 1; i >= 0; i--) {
      if (!buttons.views[i].isActive) continue;
      col = cols[i];

      x = (colX[leftIndex] - minX) * scaleX;

      ctx.beginPath();
      ctx.moveTo(x, 0);

      for (j = leftIndex; j <= rightIndex; j++, x += offsetX) {
        draw(x, col, stack, j, offsetX);
      }

      ctx.lineTo(x, 0);
      ctx.closePath();

      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }

  function stackedLines(x, col, stack, j) {
    ctx.lineTo((colX[j] - minX) * scaleX, (stack[j] - mainMinY) * scaleY);
    stack[j] -= col[j];
  }

  function stackedBars(x, col, stack, j, offsetX) {
    var y = (stack[j] - mainMinY) * mainScaleY;
    stack[j] -= col[j];
    ctx.lineTo(x, y);
    ctx.lineTo(x + offsetX, y);
  }

  function stackedCalcBounds(leftIndex, rightIndex, newLeftIndex, newRightIndex) {
    var i, j;
    stack.length = 0;
    mainMaxY = -Number.MAX_VALUE;

    for (j = newLeftIndex; j <= newRightIndex; j++) {
      stack[j] = 0;
    }

    for (i = 0; i < colsLength; i++) {
      if (!buttons.views[i].isActive) continue;

      for (j = newLeftIndex; j <= newRightIndex; j++) {
        stack[j] += cols[i][j];
      }
    }

    for (j = leftIndex; j <= rightIndex; j++) {
      mainMaxY = Math.max(mainMaxY, stack[j]);
    }

    mainMinY = 0;
    calcBoundsCommon(leftIndex, rightIndex);
  }

  function linesCalcBounds(leftIndex, rightIndex) {
    var i, j, col;
    mainMinY = Number.MAX_VALUE;
    mainMaxY = -Number.MAX_VALUE;

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
    calcBoundsCommon(leftIndex, rightIndex);
  }

  function calcBoundsCommon(leftIndex, rightIndex) {
    var i;
    minX = colX[leftIndex];
    maxX = colX[rightIndex];
    scaleX = width / (maxX - minX);
    mainMinY = app.round(mainMinY, 'floor');
    mainOffset = Math.max(1, Math.floor((mainMaxY - mainMinY) / steps));
    mainOffset = app.round(mainOffset, 'ceil');
    mainMaxY = mainMinY + mainOffset * steps;
    mainScaleY = height / (mainMaxY - mainMinY);

    if (yScaled) {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY * mainOffset / offsetY[i];
      }
    } else {
      for (i = 0; i < colsLength; i++) {
        scaleY[i] = mainScaleY;
        minY[i] = mainMinY;
        maxY[i] = mainMaxY;
        offsetY[i] = mainOffset;
      }
    }
  }
};
