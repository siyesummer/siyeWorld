# 易聊
聊天信息收发通过`socket.io`实现

## 依赖核心模块

`siye-core`包中包含了模块需要的功能: 如`utils`、`move.class.js`

## 使用

### 在项目中安装依赖，添加脚本

```shell
# 添加依赖
yarn add easy-chat

# 添加less less-loader
yarn add less less-loader -D
```

```json
{
  "scripts": {
    "serve": "yarn start-chat | vue-cli-service serve",
    "start-chat": "yarn node node_modules/easy-chat/server.js"
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

### 在项目中引入

```vue
<template>
  <EasyChat />
</template>

<script>
import EasyChat from 'easy-chat';

export default {
  components: {
    EasyChat
  }
}
<script/>
```
