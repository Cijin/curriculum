/**
 * Write a function called solution that
 *   takes in 2 parameters, a number n and string,
 *   and returns the string repeated n number of times
 * @param {number} num
 * @param {string} str
 * @returns {string}
 */

const solution = (num, str) => {
  let result = '';
  while (num > 0) {
    result += str;
    num--;
  }
  return result;
}

module.exports = {
  solution
}
