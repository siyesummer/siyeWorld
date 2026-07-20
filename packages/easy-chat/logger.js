const { createFileLogger } = require('./fileLogger');

const fileLogger = createFileLogger();

function write(stream, text) {
  if (typeof text !== 'string') {
    return;
  }
  stream.write(`${text}\n`);
}

exports.info = function info(text) {
  write(process.stdout, text);
  fileLogger.info(text);
};

exports.success = function success(text) {
  write(process.stdout, text);
  fileLogger.info(text);
};

exports.warn = function warn(text) {
  write(process.stderr, text);
  fileLogger.error(text);
};

exports.error = function error(text) {
  write(process.stderr, text);
  fileLogger.error(text);
};
