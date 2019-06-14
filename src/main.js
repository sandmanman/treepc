import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(iView);

let localToken = localStorage.getItem('token');
let expire = Number(localStorage.getItem('expire')) || 0;

if (localToken &&  expire > Date.now()) {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token');
    return config;
  }, err => {
    return Promise.reject(err);
  });

}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
