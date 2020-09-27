// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';


import echarts from 'echarts'

import App from './App'
import {routers} from './router'


import store from './store'
import axios from 'axios';

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.use(iView)

Vue.prototype.$store = store
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts


//Font-awesome icon 插件
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

//公共方法类
import util from "./util/util.js"
import x2js from 'x2js'
Vue.prototype.util = util;
Vue.prototype.$x2js = new x2js(); //创建x2js对象，挂到vue原型上

/*main.js下*/
import promise from 'es6-promise'
promise.polyfill()

Vue.config.productionTip = false

// 路由配置
const RouterConfig = {
  mode: 'hash',
  routes: routers
}
const router = new VueRouter(RouterConfig)

function guardRoute (route, redirect, next) {
  if (window.confirm(`Navigate to ${route.path}?`)) {
    next()
  } else if (window.confirm(`Redirect to /baz?`)) {
    redirect('/baz')
  }
}

// router.beforeEach((route, redirect, next) => {
//   route.meta.title = store.state.title
//   window.document.title = route.meta.title
//   if (route.matched.some(m => m.meta.needGuard)) {
//     guardRoute(route, redirect, next)
//   } else {
//     next()
//   }
// })

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  axios,
  components: { App },
  template: '<App/>',
})

// // 表格滚动条
// Vue.directive('table-scroll', (el, binding) => {
//   if(binding.value){
//     el.__vue__.$refs.body.scrollTop = 0;
//     el.__vue__.$refs.body.scrollLeft = 0;
//   }
// })
