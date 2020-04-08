/**
 * env: node
 *
 * @exports 包信息清单
 *   每个包数据结构如下:
 *     {
 *       name: String,
 *       path: String,
 *       info: JSON
 *     }
 */
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

/**
 * utils: 判断了路径是否是文件
 * @param {String} chkPath 路径
 * @returns {Boolean}
 */
function checkIsFile(chkPath) {
  if (!chkPath) {
    return false;
  }

  if (!fs.existsSync(chkPath)) {
    return false;
  }

  const stats = fs.statSync(chkPath);

  return stats.isFile();
}

/**
 * 读取 JSON 文件
 * @param {String} filePath 文件路径
 * @returns {JSON}
 */
function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  return JSON.parse(content);
}
/**
 * 读取包信息(package.json 内信息)
 * @param {String} pkgPath 包路径
 * @returns {JSON}
 */
function fetchPackageInfo(pkgPath) {
  const fullPath = path.join(pkgPath, 'package.json');

  if (!checkIsFile(fullPath)) {
    return {};
  }

  const info = readJson(fullPath);

  return info;
}

exports.host = {
  name: 'ROOT',
  path: rootDir,
  info: fetchPackageInfo(rootDir),
};
