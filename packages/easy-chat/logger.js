function write(stream, text) {
  if (typeof text !== 'string') {
    return;
  }
  stream.write(`${text}\n`);
}

exports.info = function info(text) {
  write(process.stdout, text);
};

exports.success = function success(text) {
  write(process.stdout, text);
};

exports.warn = function warn(text) {
  write(process.stderr, text);
};

exports.error = function error(text) {
  write(process.stderr, text);
};
