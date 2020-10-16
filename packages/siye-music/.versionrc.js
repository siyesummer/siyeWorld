const config = require('siye-core/config/versionrc.config');

module.exports = {
  ...config,
  // 标签前缀
  "tag-prefix": "siye-music@",
  // 日志记录路径
  "path": "./",
  // 生命周期执行配置(是否跳过)
  "skip": {
    "bump": false,
    "changelog": false,
    "commit": false,
    "tag": false
  },
  // 生命周期脚本
  "scripts": {
    "prerelease": "git pull origin master",
    // 添加标签后执行
    "posttag": "git push --tags origin master"
  },
  // 提交信息
  "release-commit-message-format": "chore(release): siye-music@{{currentTag}}"
}