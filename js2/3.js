/**
 * Write a function called solution that
 *   Takes in 2 numbers and
 *   returns an array with the length equal to the first input number.
 *     Every element in the returned array is an array,
 *        with length equal to  the second input number.
 *     All values in the array is 0.
 * @param {number} row
 * @param {number} col
 * @returns {array}
 */

const solution = (row, col, i=0, j=0, result=[], colArr=[]) => {
  if (i === row) {
    return result;
  }
  if (j === col) {
    result.push(colArr);
    return solution (row, col, i + 1, j = 0, result, colArr);
  }
  colArr[j] = 0;
  return solution (row, col, i, j + 1, result, colArr);
}

module.exports = {
  solution
}
