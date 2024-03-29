import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
// 这里定义初始值
let state = {
  title:"武警海洋环境预报综合保障平台",
  serverIP:"202.108.199.48", //产品及数据发布IP
  userName:"",
  grants:"", // 管理员1普通用户0
};

const mutations = {
  setUserName(state,msg){
    state.userName = msg;
  },
  setGrants(state,msg){
    state.grants = msg;
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
