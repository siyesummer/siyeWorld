# siyeWorld

## 说明

`packages`下每个包为一个功能模块

### 功能列表

- `siye-music`: 音乐播放器

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
