import Vue from 'vue';
import injector from 'vue-inject';
import EventBus from 'siye-core/src/modules/EventBus';
import SiyeRouter from './route/initRouter';
import App from './App';
import routes from './routeMap';
import './styles/app.less';

Vue.config.productionTip = false;

Vue.use(injector);

Vue.use(SiyeRouter);
// 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new SiyeRouter({
  routes // (缩写) 相当于 routes: routes
});

injector.service('EventBus', EventBus);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
