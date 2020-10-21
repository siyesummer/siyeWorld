# Event Bus

## 介绍

**Event Bus** 即事件总线，主要用于非简单父子关系的组件间的通信。

项目中的 Event Bus 功能通过 `service:eventBus` 提供。功能接口与 [Vue 实例事件接口](https://cn.vuejs.org/v2/api/#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95-%E4%BA%8B%E4%BB%B6) 一致。

## 准备工作

*service*功能依赖于插件[vue-inject](https://github.com/jpex-js/vue-inject)

*注册你的服务*
```js
// myService.js
class MyService{
  // ...
}
```

*配置*
```js
// main.js
import injector from 'vue-inject';
import Vue from 'vue';
import MyService './myService';

Vue.use(injector);
injector.service('MyService', MyService);
```

*声明依赖*
```js
// myComponent.vue
<script>
  export default {
    dependencies : ['MyService'],
    methods : {
      foo(){
        this.MyService.something();
      }
    }
  }
</script>
```

## 使用规范

### 1. 申明事件名称

事件列表基于各应用包维护。
事件名称 map 需要基于 `EnumType` 实现。

代码示例，`your-package/src/modules/constants/event.js`：
```JavaScript
import EnumType from 'siye-core/modules/class/EnumType';

const EVENT_LIST = ['eventA', 'eventB'];

export default Object.freeze(new EnumType(EVENT_LIST));

```

以上代码将导出一个枚举对象常量。

> 统一维护事件名称，避免发生冲突。

### 2. 注册/销毁 事件监听

`ComponentA.vue`：
```Vue
<script>
import event from '@your-package/modules/constants/event';

export default {
  dependencies: ['eventBus'],

  mounted() {
    this.eventBus.on(event.eventA, this.handler);
  },

  beforeDestory() {
    this.eventBus.off(event.eventA, this.handler);
  },

  methods: {
    handler() {
      // ...
    },
  },
}
</script>

```

!> 监听的注册 `on` 与卸载 `off` 应成对出现。

### 3. 触发事件

`ComponentB.vue`：
```Vue
<script>
import event from '@your-package/modules/constants/event';

export default {
  dependencies: ['eventBus'],

  methods: {
    trigger() {
      this.eventBus.emit(event.eventA);
    },
  },
}
</script>

```
