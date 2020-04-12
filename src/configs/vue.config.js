const rootDir = process.cwd();
const logger = require('../utils/logger');
const alias = require('./pathAlias');
const { host } = require('./packageManifest');

const { target } = (host.info && host.info.proxy) || {};

const proxy = {
  '/*': {
    target,
    changeOrigin: true,
  },
};
logger.info(`[rootDir] 根文件夹路径 ${rootDir}`);
logger.info(`[Proxy setup] 本地服务代理到 ${target}`);

function generateConf(options = {}) {
  const {
    config: optionConfig = {},
  } = options;

  return {
    publicPath: './', // 默认为 '/'
    lintOnSave: false,
    configureWebpack: {
      // 全局代理地址设置
      devServer: {
        proxy,
      },
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias,
      },
    },
    ...optionConfig
  };
}

module.exports = generateConf;
