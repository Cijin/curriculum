/**
 * Replicate Array.prototype.filter and call it cFilter
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_filter.asp
 */

const solution = () => {
  Array.prototype.cFilter = function (cb, i = 0, acc = []) {
    if (i === this.length) {
      return acc;
    }    
    if (cb (this[i], i, this)) {
      acc.push(this[i]);
    }    
    return this.cFilter (cb, i + 1, acc);
  }
}

module.exports = {
  solution
}
