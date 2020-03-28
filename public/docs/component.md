### 单个模板根节点

Vue 渲染机制规定模板 `template` 中只能有一个根节点标签，但无法满足某些需要直接渲染不需要额外父节点的多个平级节点的场景。
因此项目引入了 [vue-fragment][vue-fragment] 解决此问题。

`<fragment>` 标签可以全局直接调用：
```Vue
<template>
  <fragment>
    <span>111</span>
    <span>222</span>
  </fragment>
</template>

```
> `fragment` 不会渲染出实际节点标签。

[vue-fragment]: https://github.com/y-nk/vue-fragment 'vue-fragment'