const fs = require('fs');
const path = require('path');

function prepareFile(filePath) {
  if (!filePath || !String(filePath).trim()) {
    return null;
  }

  const absolutePath = path.resolve(String(filePath).trim());
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  const descriptor = fs.openSync(absolutePath, 'a', 0o664);
  fs.closeSync(descriptor);
  return absolutePath;
}

function createStream(filePath, label) {
  if (!filePath) {
    return null;
  }

  const stream = fs.createWriteStream(filePath, {
    flags: 'a',
    encoding: 'utf8',
    mode: 0o664,
  });
  stream.on('error', (error) => {
    process.stderr.write(
      `[file-log-error] ${label}: ${error && error.message ? error.message : String(error)}\n`,
    );
  });
  return stream;
}

function createFileLogger({
  logFile = process.env.LOG_FILE,
  errorLogFile = process.env.ERROR_LOG_FILE,
} = {}) {
  const normalStream = createStream(prepareFile(logFile), 'LOG_FILE');
  const errorStream = createStream(prepareFile(errorLogFile), 'ERROR_LOG_FILE');

  function write(stream, text) {
    if (stream && typeof text === 'string') {
      stream.write(`${text}\n`);
    }
  }

  return {
    info(text) {
      write(normalStream, text);
    },
    error(text) {
      write(errorStream, text);
    },
    close() {
      return Promise.all(
        [normalStream, errorStream]
          .filter(Boolean)
          .map(
            (stream) =>
              new Promise((resolve) => {
                stream.end(resolve);
              }),
          ),
      );
    },
  };
}

module.exports = { createFileLogger };

