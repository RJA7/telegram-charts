;(function () {
  function E(tag) {
    var e = document.createElement(tag);
    e.style.position = 'absolute';

    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.o = 1;
    this.e = e;
  }

  var p = E.prototype;

  p.constructor = E;

  p.gX = function () {
    return this.x;
  };

  p.sX = function (x) {
    this.x = x;
    this.e.style.left = x + 'px';
  };

  p.gY = function () {
    return this.y;
  };

  p.sY = function (y) {
    this.y = y;
    this.e.style.top = y + 'px';
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

  p.sS = function (scaleX, scaleY) {
    this.e.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
  };

  p.add = function (childElem) {
    this.e.appendChild(childElem.e);
  };

  p.sC = function (addClass) {
    this.e.classList.add(addClass);
  };

  p.rC = function (removeClass) {
    this.e.classList.remove(removeClass);
  };

  p.sT = function (text) {
    this.e.innerText = text;
  };

  p.sTween = function(value) {
    console.log(value)
    this.e.style.transition = value;
    this.e.style.webkitTransition = value;
  };

  p.onDown = function (handler) {
    this.e.addEventListener('mousedown', handler);
    this.e.addEventListener('touchstart', handler);
  };

  p.onUp = function (handler) {
    this.e.addEventListener('mouseup', handler);
    this.e.addEventListener('touchend', handler);
  };

  p.sO = function (opacity) {
    this.o = opacity;
    this.e.style.opacity = opacity;
  };

  app.E = E;
}());
