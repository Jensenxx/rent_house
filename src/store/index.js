import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: '' || JSON.parse(localStorage.getItem('userInfo'))
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  },
  actions: {
  },
  modules: {
  }
})
