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

// 项目内功能模块路径
const packagesDir = path.join(rootDir, 'packages');

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

/**
 * 搜集路径下的包信息
 * @param {String} pkgDir 文件夹路径
 * @returns {Array}
 */
function collectPackagesMap(pkgDir) {
  if (!fs.existsSync(pkgDir)) {
    return [];
  }

  const packages = fs.readdirSync(pkgDir);

  return packages.map(pkg => {
    const pkgPath = path.join(pkgDir, pkg);
    const info = fetchPackageInfo(pkgPath);

    return {
      name: info.name,
      path: pkgPath,
      info,
    };
  });
}

// 项目内功能模块包相关信息
const packagesInfo = collectPackagesMap(packagesDir);

exports.host = {
  name: 'ROOT',
  path: rootDir,
  info: fetchPackageInfo(rootDir),
};

exports.packagesInfo = packagesInfo;
