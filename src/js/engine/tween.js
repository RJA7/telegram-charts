import Signal from './signal';

export default class Tween {
  constructor(engine, target) {
    this.engine = engine;
    this.target = target;
    this.src = null;
    this.dst = null;
    this.keys = null;
    this.ease = null;
    this.ticks = 0;
    this.ticksLeft = 0;
    this.onComplete = new Signal();
    this.onUpdate = new Signal();
  }

  set(dst, time, ease = Tween.none) {
    this.src = {};
    this.dst = dst;
    this.keys = [];
    this.ticks = Math.max(1, Math.round(time * 60));
    this.ticksLeft = this.ticks;
    this.ease = ease;

    for (let key in dst) {
      if (!dst.hasOwnProperty(key)) continue;
      this.src[key] = this.target[key];
      this.keys.push(key);
    }

    return this;
  }

  start() {
    this.engine.tweens.indexOf(this) === -1 && this.engine.tweens.push(this);
    return this;
  }

  stop() {
    const i = this.engine.tweens.indexOf(this);
    i !== -1 && this.engine.tweens.splice(i, 1);
  }

  update() {
    const {keys, target, dst, src, onUpdate, ease, ticks} = this;
    this.ticksLeft--;
    const k = ease(1 - this.ticksLeft / ticks);

    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      target[key] = src[key] + (dst[key] - src[key]) * k;
    }

    onUpdate.dispatch(k);
  }
}

Tween.sin = {
  inOut: k => k === 0 ? 0 : k === 1 ? 1 : 0.5 * (1 - Math.cos(Math.PI * k)),
  out: k => k === 0 ? 0 : k === 1 ? 1 : Math.sin(k * Math.PI / 2),
  in: k => k === 0 ? 0 : k === 1 ? 1 : 1 - Math.cos(k * Math.PI / 2),
};

Tween.none = k => k;
