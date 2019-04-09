;(function () {
  var body = document.body;

  var input = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    isDown: false,
    moveHandlers: [],
    upHandlers: [],
    downHandlers: []
  };

  function onMouseDown(e) {
    e.preventDefault && e.preventDefault();
    input.x = e.clientX;
    input.y = e.clientY;
    input.isDown = true;

    for (var i = 0, h = input.downHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    onMouseDown(e.touches[0]);
  }

  function onMouseUp(e) {
    e.preventDefault && e.preventDefault();
    input.isDown = false;

    for (var i = 0, h = input.upHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();
    onMouseUp();
  }

  function onMouseMove(e) {
    e.preventDefault && e.preventDefault();
    input.x = e.clientX;
    input.y = e.clientY;

    for (var i = 0, h = input.moveHandlers, l = h.length; i < l; i++) {
      h[i](input);
    }
  }

  function onTouchMove(e) {
    e.preventDefault();
    onMouseMove(e.touches[0]);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);

  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchend', onTouchEnd);

  app.i = input;
}());
