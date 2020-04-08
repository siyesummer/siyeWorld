/**
 * CLI 输出工具
 * @requires npm:colors
 */
// change String.prototype that support color output
require('colors');

exports.info = function(text) {
  if (typeof text !== 'string') {
    return;
  }

  console.log(text.bold.cyan);
};

exports.success = function(text) {
  if (typeof text !== 'string') {
    return;
  }

  console.log(text.bold.blue);
};

exports.warn = function(text) {
  if (typeof text !== 'string') {
    return;
  }

  console.log(text.bold.yellow);
};

exports.error = function(text) {
  if (typeof text !== 'string') {
    return;
  }

  console.log(text.bold.red);
};
