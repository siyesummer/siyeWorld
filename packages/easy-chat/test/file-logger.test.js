const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createFileLogger } = require('../fileLogger');

async function run() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'easy-chat-log-'));
  const logFile = path.join(directory, 'socket.log');
  const errorLogFile = path.join(directory, 'socket-error.log');
  const logger = createFileLogger({ logFile, errorLogFile });

  logger.info('info-line');
  logger.error('error-line');
  await logger.close();

  assert.match(fs.readFileSync(logFile, 'utf8'), /info-line/);
  assert.match(fs.readFileSync(errorLogFile, 'utf8'), /error-line/);

  const disabledLogger = createFileLogger({ logFile: '', errorLogFile: '' });
  disabledLogger.info('stdout-only');
  disabledLogger.error('stderr-only');
  await disabledLogger.close();

  fs.rmSync(directory, { recursive: true, force: true });
}

run().then(() => {
  console.log('[OK] easy-chat file logger test passed');
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
