/*
 * 2sum: write a function that takes in an array of numbers and a number, and returns true if any pairs add up to the number. (No duplicates)
 * @param {array} arr
 * @param {number} num
 * @returns {boolean}
 */

const solution = (arr, num, isPresent = {}, isTrue = false) => {
  arr.forEach((e) => {
    if (isPresent[num - e]) {
      isTrue = true;
    }
    isPresent[e] = true;
  });
  return isTrue;
}

module.exports = {
  solution
}
