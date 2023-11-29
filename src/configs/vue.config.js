const rootDir = process.cwd();
// eslint-disable-next-line import/no-extraneous-dependencies
const logger = require('siye-core/src/utils/logger');
const {
  host
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('siye-core/src/utils/packageManifest');
const CompressionPlugin = require('compression-webpack-plugin');
const alias = require('./pathAlias');
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
      // devServer: {
      //   proxy,
      // },
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias,
      },
      plugins: [
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/, // 匹配文件名
          deleteOriginalAssets: false, // 不删除源文件
          threshold: 1024, // 对超过1k的数据压缩
          minRatio: 0.8, // 压缩比
        }),
      ],
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
