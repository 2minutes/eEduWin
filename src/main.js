// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueWechat from 'vue-wechat-title';
import VueAwesomeSwiper from 'vue-awesome-swiper';

import VueI18n from 'vue-i18n';
import En from '@/assets/lang/en';
import Zh from '@/assets/lang/zh';


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import {
    // Button, message, Form, Input, Select, Upload, Modal, Table, Tag,
// } from 'ant-design-vue';
// import Antd, {message} from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css';

import store from './store';

import '@/assets/css/common.less';
import '@/assets/css/style.less';
// import 'swiper/swiper-bundle.css';
import 'swiper/dist/css/swiper.css';

Vue.config.productionTip = false;
Vue.use(VueAwesomeSwiper,  /*{default options with global component}*/ )

Vue.use(VueWechat);

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: localStorage.lang ? localStorage.lang : 'en',
    messages: {
        'zh': Zh,
        'en': En,
    }
});
// Vue.use(Antd);
Vue.use(ElementUI);
// Vue.prototype.$message = message;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    components: { App },
    store,
    template: '<App/>'
})


// ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }]
