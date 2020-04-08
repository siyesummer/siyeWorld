# API 请求规范

## 代理设置

代理功能基于 [webpack-dev-server](https://www.webpackjs.com/configuration/dev-server/) 实现。

在项目根目录下的 `package.json` 中进行服务设置。

```JSON
{
  // ...
  "proxy": {
    "target": "http://siyefun.top"
  }
}
```

上例配置会将所有匹配代理上下文配置的请求转发至 `http://siyefun.top`。

> 代理的各配置项说明仍参照官方文档。

## API 接口申明

接口请求`request`基于`axios`封装在 `packages/package-name/src/modules`下 。

例：
```JavaScript
request.get('music', params);
```
