# siyeWorld

## 音乐播放器 api 依赖于 `netease-cloud-music-api`

详情见 [网易云音乐 Node.js API service](https://binaryify.github.io/NeteaseCloudMusicApi)
配置在根目录`package.json`中 `dependencies`下，地址为`fork`后 github 链接，去除了原项目`static`下图片文件,提升依赖安装速度

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### 依赖安装

#### 宿主依赖

```shell
yarn add <dependency-name> -W [-D]
```

#### 应用包依赖

```shell
yarn workspace <package-name> add <dependency-name> [-D]

# 例
yarn workspace siye-music add lodash
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
