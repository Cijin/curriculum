/**
 * given arr of strings (keys) and an object, return an array of values.
 * @param {array} arr {object} obj
 * @returns {array} arr
 */

const solution = (arr, obj) => {
  if (!arr.length) {
    return [];
  }
  return arr.reduce((acc, e) => {    
    if (obj[e]) {
      acc.push(obj[e]);
    }
    return acc;
  }, []);
};

module.exports = {
  solution
}
