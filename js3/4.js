/*
 * 2sum: write a function that takes in an array of numbers and a number, and returns true if any pairs add up to the number. (No duplicates)
 * @param {array} arr
 * @param {number} num
 * @returns {boolean}
 */

const solution = (arr, num, isTrue = false) => {
  arr.forEach((e, i) => {
    arr.forEach((el, idx) => {
      if (el + e === num && i !== idx) {
        isTrue = true;
      }
    });
  });
  return isTrue;
}

module.exports = {
  solution
}
