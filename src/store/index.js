import Vue from 'vue'
import router from '../router'
import vuex from 'vuex'
import $ from "jquery"
Vue.use(vuex);
export default new vuex.Store({
	
  state: { //$store.state.a调用
    head_portrait : window.localStorage.getItem('head_portrait'),//首页头像
	assets:window.localStorage.getItem('assets'),//首页资产
	hasPrize:window.localStorage.getItem('hasPrize'),//转盘奖品
	task_money:window.localStorage.getItem('task_money'),//完成任务奖品
	assetOne:window.localStorage.getItem('assetOne'),//一键完成任务奖品
	
	// stated:[]
  },
  mutations: { //$store.commit('sum')调用
     //更换头像
    changeHead(state) {
      // 变更状态
     state.head_portrait = window.localStorage.getItem('head');
	 localStorage.setItem('head_portrait', state.head_portrait)
    },
	//完成任务首页资产增加
	 addAssets(state) {
	  // var taskObj = JSON.parse(state.task || '[]'); //json字符串转换为json对象
	  var count = Number(state.assets) + Number(state.hasPrize) ;//Number(state.assets)字符串转换为数字
	  state.assets = count;
	  // sconsole.log(state.assets)
      window.localStorage.setItem('assets', state.assets);
	},
	
  },
  actions: {//$store.dispatch('handler')调用
    
  },
  getters: {//计算属性

  },
})
