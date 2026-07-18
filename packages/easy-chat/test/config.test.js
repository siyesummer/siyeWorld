const assert = require('assert');
const { requireEnv } = require('../config/env');

delete process.env.EASY_CHAT_MISSING_TEST_VALUE;
assert.throws(
  () => requireEnv('EASY_CHAT_MISSING_TEST_VALUE'),
  /EASY_CHAT_MISSING_TEST_VALUE/,
);

process.env.VUE_APP_SOCKET_URL = 'http://localhost:3030';
process.env.VUE_APP_CHAT_HISTORY_API_BASE_URL = 'http://localhost:8081';
process.env.PORT = '3030';
process.env.CORS_ALLOW_ORIGIN = 'http://localhost:8080';

const browserConfig = require('../config');
const serverConfig = require('../config/server');

assert.strictEqual(browserConfig.CONNECT_URL, process.env.VUE_APP_SOCKET_URL);
assert.strictEqual(
  browserConfig.CHAT_HISTORY_API_BASE_URL,
  process.env.VUE_APP_CHAT_HISTORY_API_BASE_URL,
);
assert.strictEqual(serverConfig.LISTENING_PORT, process.env.PORT);
assert.strictEqual(serverConfig.CORS_ALLOW_ORIGIN, process.env.CORS_ALLOW_ORIGIN);

console.log('[OK] easy-chat required env tests passed');
