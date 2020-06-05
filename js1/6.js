/**
 * Write a function called solution that
 *   takes in a number
 *   and returns true if the number is a prime number
 *   false otherwise
 * @param {number} num
 * @returns {boolean}
 */
const solution = (num, i = 2) => {
  if (num <= 1) { return false; }
  
  for(i = 2;i <= num / 2; i++) {
    if (num % i === 0) {
      return false;
    }
  }  
  return true;
}

module.exports = {
  solution
}
