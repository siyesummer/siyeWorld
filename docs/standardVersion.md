# standard-version 自动化提交发布

## 介绍

- 插件详情[standard-version](https://github.com/conventional-changelog/standard-version)。

### 工作流程

1. 通过查看`bumpFiles`，如`package-lock.json`检索存储库的当前版本`git tag`，`bumpFiles`是指需要进行版本升级校验的文件。
2. 根据提交记录，自动升级版本号(也可以指定版本号)。
3. 根据提交内容生成`CHANGELOG.md`文件内容，提交需要遵守规范[约定式提交](https://www.conventionalcommits.org/en/v1.0.0/)。
4. 创建一个`commit`，内容包括`bumpFiles`和更新的`CHANGELOG.md`。
5. 根据新的版本号创建`tag`。

## 配置

### 配置方式

这里以`.versionrc.js`单文件配置方式为例，默认导出必须是配置对象或返回配置对象的函数，其他配置方式请参看详细文档。

```JavaScript
module.exports = {
  // 标签前缀
  "tag-prefix": "v",
  ...
}
```

### 配置详情

#### 变更日志对应文件

- infile: String，默认为`CHANGELOG.md`。

#### 标签前缀

- tag-prefix: String ，默认为`v`。

#### 日志记录路径

- path: String 只记录在此路径下进行的提交，默认为`""`。

```JavaScript
{
  "path": "packages/*"
}
```

#### 提交信息

- release-commit-message-format: String `commit`提交信息，默认为`chore(release): {{currentTag}}`，其中`currentTag`为版本号。

#### 生命周期脚本

**配合脚本可以实现自动发布**

- prerelease 在任何生命周期事件发生之前执行。如果`prerelease`脚本返回一个非零的退出代码，版本控制将被中止，但对进程没有其他影响。
- prebump 在版本更改前执行，如果`prebump`脚本返回版本号，则将使用它，而不是使用计算后的版本。
  可以直接返回版本号如`echo 6.6.6`，也可以使用版本号对比校验插件，如`standard-version`依赖的`conventional-recommended-bump`插件。
- postbump 在版本更改后执行。
- prechangelog `CHANGELOG`创建前执行。
- postchangelog `CHANGELOG`创建后执行。
- precommit `commit`前执行。
- postcommit `commit`后执行。
- pretag 创建标签前。
- posttag 创建标签后。

```JavaScript
{
  "scripts": {
    "prerelease": "git pull origin master",
    "posttag": "git push --tags origin master && npm publish --access public"
  }
}
```

#### 跳过生命周期步骤

- skip: Object，可以跳过任意生命周期步骤`(bump, changelog, commit, tag)`，默认不跳过。
  **_跳过生命周期步骤时其对应生命周期脚本也不会执行_**

```JavaScript
{
  "skip": {
    "changelog": true
  }
}
```

#### 日志显示提交信息分类

- types: Array，`CHANGELOG`默认只显示`feat`和`fix`类型提交记录。

```JavaScript
{
  "types": [
    {
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
    }
  ]
}
```

## 使用

_请勿手动修改版本号_

### 安装

在`package.json`中添加依赖和脚本。

```json
{
  "scripts": {
    "release": "standard-version"
  },
  "devDependencies": {
    "standard-version": "^9.0.0"
  }
}
```

### 查看帮助

```shell
npm run pub -- --help
```

### 自动升级版本

执行脚本

```shell
npm run pub
```

#### 自动升级规则(测试结果总结)

- 主要根据统计提交日志中`BREAKING CHANGE`和`feat`数目升级版本号。

1. 主版本<`1`，即版本号为`0.\*.\*`时，含`BREAKING CHANGE`升级次版本，其余升级修订版本。
2. 主版本>`1`，即版本号为`1.\*.\*`以上时，含`BREAKING CHANGE`升级主版本，含`feat`升级次版本，其余升级修订版本。
   `BREAKING CHANGE`类型提交`description`中需要以`BREAKING CHANGE`开头

### 升级指定版本

#### 升级测试版本

- 自动升级版本号，并附上关键词。

以`1.0.1`版本为例

```shell
npm run pub -- --prerelease
```

版本号生成为`1.0.1-0`

```shell
npm run pub -- --prerelease alpha
```

版本号生成为`1.0.1-alpha.0`

```shell
npm run pub -- --prerelease beta
```

版本号生成为`1.0.1-beta.0`

#### 指定版本号

- 指定升级不同级别版本号
  `major, minor, patch`主版本，次版本，修订版

```shell
npm run pub -- --release-as minor
```

- 指定升级具体版本号

```shell
npm run pub -- --release-as 1.1.0
```

#### CLI 用法

_使用 CLI 配置优先级将高于配置文件_

- 指定提交信息

```shell
npm run pub -- --message "chore(release): @v{{currentTag}}"
```
