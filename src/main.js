// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import {routers} from './router'

//Font-awesome icon 插件
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText} from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css'
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'

import store from './store'
import axios from 'axios'
import echarts from 'echarts'
import sha256 from 'js-sha256'
import Constant from './util/Constant'
import globalURL from './util/globalURL'
import globalBus from './components/globalBus'
import util from "./util/util.js"
import {getCookie, setCookie, delCookie} from './util/cookie'
import x2js from 'x2js'
/*main.js下*/
import promise from 'es6-promise'

promise.polyfill();
axios.defaults.withCredentials = true;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(iView);
// Vue.use(Vuetify);

Vue.prototype.$store = store;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.Constant = Constant;
Vue.prototype.$globalURL = globalURL;
Vue.prototype.$sha256 = sha256;
Vue.prototype.util = util;
Vue.prototype.$x2js = new x2js(); //创建x2js对象，挂到vue原型上
Vue.prototype.$cookies = {getCookie, setCookie, delCookie};

Vue.config.productionTip = false;


// ------------------------ axios 请求和返回 访问拦截 ------------------------
axios.interceptors.request.use(config => {
  console.log("axios.interceptors.request: config", config);
  if (getCookie(Constant.cookieUserKey) === "") {
    router.push('/login');
  }
  // if (localStorage.token) {
  //   config.headers.Authorization = `token ${localStorage.token}`
  // }
  return config
}, err => {
  return Promise.reject(err)
});

axios.interceptors.response.use((response) => {
  console.log("axios.interceptors.response: response", response);
  return response;
}, (error) => {
  console.log("axios.interceptors.response: error.response", error);
  return Promise.reject(error.response.data)
});
// ------------------------ axios 请求和返回 访问拦截 ------------------------


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

// 路由配置
const RouterConfig = {
  mode: 'hash',
  routes: routers
};
const router = new VueRouter(RouterConfig);

function guardRoute(to, from, next) {
  let userKey = Constant.cookieUserKey;
  let userValue = getCookie(userKey);

  if (userValue !== "") {
    store.commit('setUserName', userValue);
    next()
  } else {
    next({path: '/login'});
  }
}

router.beforeEach((to, from, next) => {
  to.meta.title = store.state.title;
  window.document.title = to.meta.title;
  if (to.matched.some(m => m.meta.needGuard)) {
    guardRoute(to, from, next)
    // next()
  } else {
    console.log(to.fullPath, from.fullPath);
    next()
  }
});

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  axios,
  components: {App},
  template: '<App/>',
});

// // 表格滚动条
// Vue.directive('table-scroll', (el, binding) => {
//   if(binding.value){
//     el.__vue__.$refs.body.scrollTop = 0;
//     el.__vue__.$refs.body.scrollLeft = 0;
//   }
// });
