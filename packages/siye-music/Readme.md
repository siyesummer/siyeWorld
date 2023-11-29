# 音乐播放器

_音乐播放器 api 依赖于 [netease-cloud-music-api](https://github.com/Binaryify/NeteaseCloudMusicApi)_
详情见 [网易云音乐 Node.js API service](https://binaryify.github.io/NeteaseCloudMusicApi)

## 依赖核心模块

`siye-core`包中包含了模块需要的功能: 如`request`，`service`

## 使用

### 在项目中安装依赖，添加脚本

```shell
# 添加依赖
yarn add siye-music

# 添加less less-loader
yarn add less less-loader -D
```

```json
{
  "scripts": {
    "serve": "yarn run start-netease-api | vue-cli-service serve",
    "start-netease-api": "yarn node node_modules/siye-music/app.js"
  },
  "dependencies": {
    "siye-music": "^0.1.4"
  },
  "devDependencies": {
    "less": "^3.11.1",
    "less-loader": "^5.0.0"
  }
}
```

### `babel.config.js`配置

模块引入了`ant-design-vue`组件，需要在项目中配置按需加载

```json
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "ant-design-vue",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ]
}
```

### `vue.config.js`配置

`ant-design-vue`组件库使用了`less`，需要在项目中配置

```JavaScript
module.exports = {
  // 样式相关配置
  css: {
    sourceMap: false, // 仅需调试样式时设置为 true ! 开启后会显著影响构建速度
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }

  // vue-cli4版本配置
  css: {
    sourceMap: false, // 仅需调试样式时设置为 true ! 开启后会显著影响构建速度
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        }
      }
    }
  }
}
```
### `main.js`配置

*service*功能依赖于插件[vue-inject](https://github.com/jpex-js/vue-inject)

```js
// main.js
import injector from 'vue-inject';
import EventBus from 'siye-core/src/modules/EventBus';

Vue.use(injector);
injector.service('EventBus', EventBus);
```

### 在项目中引入

```vue
<template>
  <siyeMusic />
</template>

<script>
import siyeMusic from 'siye-music';

export default {
  components: {
    siyeMusic
  }
}
<script/>
```
