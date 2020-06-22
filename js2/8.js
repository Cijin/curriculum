/**
 * Replicate Array.prototype.map function and call it cMap
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_map.asp
 */

const solution = () => {
  Array.prototype.cMap = function (cb, i = 0, acc = []) {
    if (i === this.length) {
      return acc;
    }
    acc[i] = cb (this[i], i, this);
    return this.cMap (cb, i + 1, acc);
  }
}

module.exports = {
  solution
}
