import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isSignin: localStorage.getItem('isSignin') === 'true',
    user: JSON.parse(localStorage.getItem('user')),
    tree: JSON.parse(localStorage.getItem('tree')),
    usercorp: localStorage.getItem('usercorp') ? JSON.parse(localStorage.getItem('usercorp') || null) : null,
  },
  mutations: {
    setSignin(store, data) {
      store.isSignin = data;
      localStorage.setItem('isSignin', data);
    },
    setUser(store, data) {
      store.user = data;
      localStorage.setItem('user', JSON.stringify(data))
    },
    setTree(store, data) {
      store.tree = data;
      localStorage.setItem('tree', JSON.stringify(data))
    },
    setUsercorp(store, data) {
      store.usercorp = data;
      localStorage.setItem('usercorp', JSON.stringify(data))
    },
  },
  getters: {
    isSuperAdmin: state => {
      return state.usercorp && state.usercorp.role === 30;
    },
    isAdmin: state => {
      return state.usercorp && [20, 30].indexOf(state.usercorp.role) > -1
    },
    isCommon: state => {
      return  state.usercorp && state.usercorp.role === 10;
    },
  }
})
