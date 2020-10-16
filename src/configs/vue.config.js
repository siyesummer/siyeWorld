const rootDir = process.cwd();
const logger = require('siye-core/src/utils/logger');
const alias = require('./pathAlias');
const {
  host
} = require('siye-core/src/utils/packageManifest');
const defaultTheme = require('./theme');

const {
  target
} = (host.info && host.info.proxy) || {};

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
    theme = defaultTheme,
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
    // 样式相关配置
    css: {
      sourceMap: false, // 仅需调试样式时设置为 true ! 开启后会显著影响构建速度
      loaderOptions: {
        less: {
          modifyVars: theme,
          javascriptEnabled: true,
        },
      },
    },
    ...optionConfig
  };
}

module.exports = generateConf;
