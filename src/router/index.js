import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import home from './home'
import info from './info'
import mine from './mine'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  home,
  info,
  mine
]

const router = new VueRouter({
  routes
})

export default router
