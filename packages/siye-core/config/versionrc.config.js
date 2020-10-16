module.exports = {
  // 标签前缀
  "tag-prefix": "v",
  // 生命周期执行配置(是否跳过)
  "skip": {
    "bump": false,
    "changelog": false,
    "commit": false,
    "tag": false
  },
  // 生命周期脚本
  "scripts": {
    // 添加标签后执行
    "posttag": "git push --tags origin master"
  },
  // 提交信息
  "release-commit-message-format": "chore(release): @v{{currentTag}}",
  // 日志显示分类类型
  "types": [{
      "type": "feat",
      "section": "Features"
    },
    {
      "type": "fix",
      "section": "Bug Fixes"
    },
    {
      "type": "chore",
      "hidden": true
    },
    {
      "type": "docs",
      "section": "Docs"
    },
    {
      "type": "style",
      "section": "Style"
    },
    {
      "type": "refactor",
      "section": "Refactor"
    },
    {
      "type": "Revert",
      "section": "Revert"
    },
    {
      "type": "improvement",
      "section": "Improvement"
    }
  ]
}