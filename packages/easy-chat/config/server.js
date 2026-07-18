const { requireEnv } = require('./env');

// 服务端运行参数必须由 Compose 或 easy-chat 的 .env 类文件注入。
const LISTENING_PORT = requireEnv('PORT');
const CORS_ALLOW_ORIGIN = requireEnv('CORS_ALLOW_ORIGIN');

module.exports = {
  LISTENING_PORT,
  CORS_ALLOW_ORIGIN,
};
