app.DiagramP = function (width, height, buttons, hLines, addReserve) {
  var canvas, ctx;

  var view = new app.E('div');
  view.sW(width);
  view.sH(height);

  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d', {alpha: false});
  canvas.width = width;
  canvas.height = height;
  canvas.style.transform = 'scale(1, -1)';
  canvas.style.height = height + 'px';
  canvas.style.position = 'absolute';
  view.e.appendChild(canvas);

  return {
    view: view,
    bgColor: '#ffffff',
    overlayLayer: new app.E('div'),

    setOver: function (overview) {

    },

    setDat: function (dat) {},

    getY: function (colIndex, index) {
      // return (cols[colIndex][index] - minY[colIndex]) * scaleY[colIndex];
    },

    render: function (leftIndex, rightIndex, axisX, axesY) {

    }
  }
};
