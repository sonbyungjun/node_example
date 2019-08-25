const { odd, even } = require('./var.js');
const checkNumbar = require('./func');

function checkStringOddOrEven(str) {
  if (str.length % 2) {
    return odd;
  }
  return even;
}

console.log(checkNumbar(10));
console.log(checkStringOddOrEven('hello'));
console.log(global)
