import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import injector from 'vue-inject';
// eslint-disable-next-line import/no-extraneous-dependencies
import EventBus from 'siye-core/src/modules/EventBus';
import SiyeRouter from './route/initRouter';
import App from './App';
import routes from './routeMap';
import store from './store';
import './styles/app.less';
// eslint-disable-next-line import/order
import { Modal } from 'ant-design-vue';

Vue.config.productionTip = false;

Vue.use(injector);

Vue.use(Modal);

Vue.use(SiyeRouter);
// 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new SiyeRouter({
  routes, // (缩写) 相当于 routes: routes
});

injector.service('EventBus', EventBus);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
