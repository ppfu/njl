// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import './vuex/font'
import store from './store'
import axios from 'axios'
import Qs from 'qs'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import Vant from 'vant';
import 'vant/lib/index.css';
import { NumberKeyboard ,Rate,Switch} from 'vant';
Vue.use(Vant,Rate,Switch);


import VueClipboard from 'vue-clipboard2' 
Vue.use(VueClipboard)
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})
//为AlloyFinger创建vue实例

// Axios.defaults.headers.common['Authentication-Token'] = store.state.token;
//解决axios发送两次请求
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.transformRequest = [obj => Qs.stringify(obj)]
//解决验证码比对不正确
axios.defaults.withCredentials = true //
//指定baseurl
const BASE_URL = 'http://njl.qilinpz.com/api/';
axios.defaults.baseURL=BASE_URL;
Vue.use(MintUI)

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 响应拦截器
axios.interceptors.response.use(
response => {
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
  if (response.status === 200) {
    if (response.data.code == 1) { // 登录过期去登录页
      // Toast({
      //   message: response.data.msg,
      //   duration: 1000,
      // });
      router.replace({
        path: '/login',
      });
    } else {
      
    }
    return Promise.resolve(response);
  } else {
    return Promise.reject(response);
  }
},
error => {
  // 否则的话抛出错误
  if (error.response.status) {
    return Promise.reject(error.response);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
