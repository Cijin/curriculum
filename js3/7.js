/*
 * write a map function for objects
 * @param {callback} cb
 * @returns {number}
*/

const solution = () => {
  Object.prototype.map = function (cb, i = 0, res = []) {
    let keys = Object.keys(this);    
    if (i === keys.length) {
      return res;
    }
    res[i] = cb (keys[i], this[keys[i]], i);
    return this.map(cb, i + 1, res);
  }
}

module.exports = {
  solution
}
