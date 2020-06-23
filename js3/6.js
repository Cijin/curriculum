/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
*/

const solution = (arr, res = [], counter = {}) => {
  arr.forEach((e) => {
    counter[e] = (counter[e] || 0) + 1;
    if (counter[e] > 1 && !res.includes(e)) {
      res.push(e);
    }
  });
  return res;
};

module.exports = {
  solution
}
