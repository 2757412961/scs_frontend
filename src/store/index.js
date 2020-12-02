import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
// 这里定义初始值
let state = {
  title:"海洋环境预报综合保障平台",
  userName:"",
  category:"",//管理员1普通用户0
  serverIP:"202.108.199.48",//产品及数据发布IP
};

const mutations = {
  setUserName(state,msg){
    state.userName = msg;
  },
  setCategory(state,msg){
    state.category = msg;
  }
};

// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {

};

// 返回改变后的数值
const getters = {

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
