/**
 * Vue-cli 配置
 */
const generateConf = require('./src/configs/vue.config');

const REQUIRED_FRONTEND_ENV = [
  'VUE_APP_MUSIC_API_BASE_URL',
  'VUE_APP_SOCKET_URL',
  'VUE_APP_CHAT_HISTORY_API_BASE_URL',
  'VUE_APP_LOG_SERVER_BASE_URL',
  'VUE_APP_PUBLIC_PATH',
  'VUE_APP_ROUTER_MODE',
];

if (['serve', 'build'].includes(process.argv[2])) {
  const missingEnv = REQUIRED_FRONTEND_ENV.filter(name => !process.env[name]);
  if (missingEnv.length) {
    throw new Error(
      `缺少前端环境变量：${missingEnv.join(', ')}。请检查当前模式对应的 .env.development 或 .env.production。`,
    );
  }
}

if (process.env.VUE_APP_ROUTER_MODE && !['history', 'hash'].includes(process.env.VUE_APP_ROUTER_MODE)) {
  throw new Error('VUE_APP_ROUTER_MODE 只允许使用 history 或 hash。');
}

const conf = generateConf({
  config: {
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
  },
});

module.exports = conf;
