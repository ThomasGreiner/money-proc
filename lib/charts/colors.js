"use strict";

class HSL {
  constructor([h, s, l]) {
    this._h = h;
    this._s = s;
    this._l = l;
  }
  
  get lightness() {
    return this._l;
  }
  
  set lightness(l) {
    this._l = Math.max(0, Math.min(100, l));
    return this._l;
  }
  
  toString() {
    return `hsl(${this._h}, ${this._s}%, ${this._l}%)`;
  }
}
exports.HSL = HSL;

exports.GREEN = [100, 43, 53];
exports.RED = [15, 86, 47];
