const rootDir = process.cwd();
// eslint-disable-next-line import/no-extraneous-dependencies
const logger = require('siye-core/src/utils/logger');
const {
  host,
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('siye-core/src/utils/packageManifest');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const alias = require('./pathAlias');
const defaultTheme = require('./theme');

const { target } = (host.info && host.info.proxy) || {};

// const proxy = {
//   '/*': {
//     target,
//     changeOrigin: true,
//   },
// };
logger.info(`[rootDir] 根文件夹路径 ${rootDir}`);
logger.info(`[Proxy setup] 本地服务代理到 ${target}`);

function generateConf(options = {}) {
  const { config: optionConfig = {}, theme = defaultTheme } = options;

  return {
    publicPath: './', // 默认为 '/'
    lintOnSave: false,
    // 是否需要生产环境的 source map（源映射文件，帮助开发者在浏览器的开发者工具中，将错误和日志定位到原始代码的具体位置）
    productionSourceMap: false,
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
        // 打包文件压缩插件
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/, // 匹配文件名
          deleteOriginalAssets: false, // 删除源文件
          threshold: 1024, // 对超过1k的数据压缩
          minRatio: 0.8, // 压缩比
        }),
        // 打包文件分析插件
        new BundleAnalyzerPlugin({
          analyzerPort: 8889, // 指定端口号
          openAnalyzer: true,
        }),
      ],
    },
    chainWebpack: configs => {
      configs.optimization.splitChunks({
        chunks: 'all', // 表示哪些代码需要优化，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
        maxInitialRequests: Infinity, // 按需加载时候最大的并行请求数，默认为5
        minSize: 100 * 1024, // 依赖包或模块stat size超过100k将被单独打包
        minChunks: 1, // 模块被引用设置次数及以上的才抽离

        cacheGroups: {
          vue: {
            // 拆分vue
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            name: 'vue',
            priority: 2,
          },
          antDesign: {
            // 拆分ant-design-vue
            test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
            name: 'ant-design-vue',
            priority: 3,
          },
          antDesignIcons: {
            // 拆分ant-design-icons
            test: /[\\/]node_modules[\\/]@ant-design[\\/]icons/,
            name: 'ant-design-icons',
            priority: 4,
          },
          moment: {
            // 拆分moment
            test: /[\\/]node_modules[\\/]moment/,
            name: 'moment',
            priority: 5,
          },
          lodash: {
            // 拆分lodash
            test: /[\\/]node_modules[\\/]lodash/,
            name: 'lodash',
            priority: 6,
          },
          common: {
            // 拆分第三方库（通过npm|yarn安装的库）
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all',
            priority: 1,
          },
          // 音乐播放器模块
          siyeMusic: {
            test: /(packages[\\/]siye-music[\\/])/,
            name: 'siye-music',
            chunks: 'all',
            priority: 6,
          },
        },
      });
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
    ...optionConfig,
  };
}

module.exports = generateConf;
