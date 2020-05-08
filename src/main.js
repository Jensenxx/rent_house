import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible'
import './assets/css/reset.css'
import api from './api'
import gallery from 'img-vuer'
import BaiduMap from 'vue-baidu-map'
import {
  Toast,
  Popup,
  Checkbox,
  CheckboxGroup,
  Uploader,
  Dialog,
  Overlay,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  List,
  PullRefresh,
  Grid,
  GridItem,
  Icon,
  Button,
  Field,
  Swipe,
  SwipeItem,
  Lazyload
} from 'vant'

Vue.config.productionTip = false
Vue.use(Popup)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Uploader)
Vue.use(Dialog)
Vue.use(Overlay)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Field)
Vue.use(gallery)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Lazyload)
Vue.use(BaiduMap, {
  ak: 'lIXbW84tKu6oNCj0bbgTnau7'
})
Vue.prototype.$api = api
Vue.prototype.showToast = obj => Toast({
  type: obj.type || 'text',
  message: obj.msg || '',
  forbidClick: true,
  duration: 1000 || obj.time
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
