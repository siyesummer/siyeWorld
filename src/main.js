import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/dist/antd.css';
import SiyeRouter from './route/initRouter';
import App from './App';
import routes from './routeMap';
import './styles/app.less';

Vue.component(Button.name, Button);

Vue.config.productionTip = false;

Vue.use(SiyeRouter);
// 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new SiyeRouter({
  routes // (缩写) 相当于 routes: routes
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
