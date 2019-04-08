;(function () {
  function E(tag) {
    var e = document.createElement(tag);
    e.style.position = 'absolute';

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.ax = 0;
    this.ay = 0;
    this.e = e;
    this.o = 1;
  }

  var p = E.prototype;

  p.constructor = E;

  p.gX = function () {
    return this.x;
  };

  p.sX = function (x) {
    this.x = x;
    this.e.style.left = x - this.ax * this.w + 'px';
  };

  p.gY = function () {
    return this.y;
  };

  p.sY = function (y) {
    this.y = y;
    this.e.style.top = y - this.ay * this.h + 'px';
  };

  p.gW = function () {
    return this.w;
  };

  p.sW = function (width) {
    this.w = width;
    this.e.style.width = width + 'px';
  };

  p.gH = function () {
    return this.h;
  };

  p.sH = function (height) {
    this.h = height;
    this.e.style.height = height + 'px';
  };

  p.sA = function (anchorX, anchorY) {
    this.ax = anchorX;
    this.ay = anchorY;
    this.sX(this.x);
    this.sY(this.y);
  };

  p.sS = function (scaleX, scaleY) {
    this.e.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
  };

  p.add = function (childElem) {
    this.e.appendChild(childElem.e);
  };

  p.sC = function (addClass, removeClass) {
    this.e.classList.add(addClass);
    removeClass && this.e.classList.remove(removeClass);
  };

  p.sT = function (text) {
    this.e.innerText = text;
  };

  p.onDown = function (handler) {
    this.e.addEventListener('mousedown', handler);
    this.e.addEventListener('touchstart', handler);
  };

  p.sO = function (opacity) {
    this.o = opacity;
    this.e.style.opacity = opacity;
  };

  app.E = E;
}());
