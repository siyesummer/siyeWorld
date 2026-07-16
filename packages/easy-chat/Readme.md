# 易聊

聊天信息实时收发通过 `socket.io` 实现，历史消息由前端直接调用 `linux-server` 保存和查询。

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

### `vue.config.js`配置

模块组件使用了`less`，需要在项目中配置

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

## 消息持久化开关

`EasyChat` 默认会把用户发送的消息同时交给两条互不依赖的链路：

1. 通过 Socket Server 实时广播。
2. 由浏览器直接请求 `linux-server` 的 `POST /api/chat/messages` 接口保存到 MySQL。

默认开启持久化：

```vue
<EasyChat />
```

只需要实时聊天、不保存历史消息时，可以关闭：

```vue
<EasyChat :persist-messages="false" />
```

保存失败不会阻断 Socket 消息广播。调用方可以监听失败事件并决定如何提示用户或重试：

```vue
<EasyChat @message-persist-error="handlePersistError" />
```

```js
methods: {
  handlePersistError({ error, message }) {
    console.error('消息保存失败', error, message);
  },
}
```

前端保存和查询历史消息使用 `config/index.js` 中的 `CHAT_HISTORY_API_BASE_URL`。Socket Server 不再读取该配置，也不会直接访问 `linux-server`。

## 聊天身份缓存

组件会使用浏览器 `localStorage` 保存当前聊天身份：

- `easy-chat:sender-id`：Socket 消息中的发送人 ID。
- `easy-chat:user-name`：聊天昵称。

页面重新加载时会优先恢复这两个值，因此同一个浏览器会继续使用原来的 `senderId` 和昵称。清理浏览器站点数据后，组件会重新生成一个发送人 ID。
