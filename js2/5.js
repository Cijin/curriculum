/**
 * Write a function called solution that
 *   Takes in an array of functions and a number,
 *   and calls every function input milliseconds later
 * @param {array} arr
 * @param {number} time
 */

const solution = (arr, time, i = 0) => {
  arr.map(e => {
    setTimeout(e, time);
  });
};

module.exports = {
  solution
}
