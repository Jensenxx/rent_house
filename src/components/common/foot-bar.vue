<template>
  <div>
    <router-view />
     <van-tabbar v-model="activeIndex">
      <van-tabbar-item icon="home-o" replace to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="coupon-o" replace to="/info">咨询</van-tabbar-item>
      <van-tabbar-item icon="contact" replace to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  props: {
    active: {
      type: Number,
      require: true,
      default: 0
    }
  },
  computed: {
    activeIndex: {
      set () {

      },
      get () {
        return this.active
      }
    }
  }
}
</script>
