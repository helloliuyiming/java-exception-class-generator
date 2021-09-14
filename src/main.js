import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Plugin from 'v-fit-columns';
Vue.use(Plugin);

Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  render: h => h(App),
}).$mount('#app')
