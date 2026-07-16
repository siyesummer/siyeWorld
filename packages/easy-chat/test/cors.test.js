const assert = require('assert');
const {
  createCorsOriginOption,
  parseAllowedOrigins,
} = require('../cors');

assert.deepStrictEqual(
  parseAllowedOrigins('http://localhost:8080, https://music.siyes.cn'),
  ['http://localhost:8080', 'https://music.siyes.cn']
);
assert.deepStrictEqual(parseAllowedOrigins(''), ['*']);
assert.strictEqual(createCorsOriginOption('*'), '*');

const validateOrigin = createCorsOriginOption('http://localhost:8080,https://music.siyes.cn');

validateOrigin('http://localhost:8080', (error, allowed) => {
  assert.ifError(error);
  assert.strictEqual(allowed, true);
});

validateOrigin(undefined, (error, allowed) => {
  assert.ifError(error);
  assert.strictEqual(allowed, true);
});

validateOrigin('https://example.com', error => {
  assert(error);
  assert.match(error.message, /not allowed/);
});

process.stdout.write('[OK] easy-chat CORS tests passed\n');
