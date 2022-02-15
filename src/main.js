import { createApp } from 'vue'
import App from './App.vue'
import { plugin as VueInputAutowidth } from 'vue-input-autowidth'
import './index.css'
import FitColumns from 'v-fit-columns';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


let vue = createApp(App);
    vue.use(ElementPlus)
    .use(FitColumns)
    .use(VueInputAutowidth)
    .mount('#app');
