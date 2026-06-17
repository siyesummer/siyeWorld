/**
 * env: node
 * 生成 webpack-dev-server 的 alias 配置
 */
const path = require('path');
const { packagesInfo, host } = require('siye-core/src/utils/packageManifest');

const alias = {};

packagesInfo.forEach(pkg => {
  // 增加包下 'src/' 路径别名
  // scoped 包（@scope/name）取最后一段作为别名，避免 @@ 双写
  const name = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;
  alias[`@${name}`] = path.join(pkg.path, 'src');
});

alias['@ROOT'] = path.join(host.path, 'src');

module.exports = alias;
