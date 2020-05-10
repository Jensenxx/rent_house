import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import home from './home'
import info from './info'
import mine from './mine'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  home,
  info,
  mine
]

const router = new VueRouter({
  routes
})

export default router
