/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
*/

const solution = (arr, res = []) => {
  arr.forEach((e, i) => {
    arr.forEach((el, idx) => {
      if (e === el && i !== idx && !res.includes(e)) {
        res.push(e);
      }
    });
  });
  return res;
};

module.exports = {
  solution
}
