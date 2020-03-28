import Vue from 'vue';
import Button from 'ant-design-vue/lib/button';
import 'ant-design-vue/dist/antd.css';
import { Plugin } from 'vue-fragment';
import App from './App';

Vue.component(Button.name, Button);
Vue.use(Plugin);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
