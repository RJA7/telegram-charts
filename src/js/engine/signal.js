export default class Signal {
  constructor() {
    this.bindings = [];
  }

  add(handler, ctx, index) {
    this.bindings.splice(this._getIndex(index), 1, {handler, ctx, isOnce: false});
    return this;
  }

  addOnce(handler, ctx, index) {
    this.bindings.splice(this._getIndex(index), 1, {handler, ctx, isOnce: true});
    return this;
  }

  _getIndex(index) {
    return index ? Math.max(0, Math.min(this.bindings.length, index)) : this.bindings.length;
  }

  remove(handler, ctx) {
    const {bindings} = this;

    for (let i = bindings.length - 1; i >= 0; i--) {
      if (bindings[i].handler === handler && bindings[i].ctx === ctx) {
        bindings.splice(i, 1);
      }
    }
  }

  removeAll() {
    this.bindings.length = 0;
  }

  dispatch(a, b, c) {
    const {bindings} = this;
    let l = bindings.length;
    let i = 0;

    while (i < l && (bindings[i].ctx ? bindings[i].handler.call(bindings[i].ctx, a, b, c) : bindings[i].handler(a, b, c)) !== false) {
      i++;
    }

    while (l > 0) {
      l--;
      bindings[l].isOnce && bindings.splice(l, 1);
    }

    return this;
  }
}
