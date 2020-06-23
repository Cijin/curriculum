/*
 * Write a function that takes in an object and a number (millieseconds).
 * - You must call each function value of the object {"nVal": (k) => {...}}
 * - {"nVal": (k) => {...When this function runs, k is "nVal"...}}
 * @param {object} obj
 * @param {number} num (millieseconds)
 * @call each function value of the object, millieseconds after each other
*/

const solution = (obj, num, i = 0) => {
  let keys = Object.keys(obj);
  if (i === keys.length) {
    return
  }
  obj[keys[i]](keys[i]);
  setTimeout(() => {
    return solution (obj, num, i + 1);
  }, num);
};

module.exports = {
  solution
}
