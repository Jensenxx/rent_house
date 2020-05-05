<template>
  <van-nav-bar :title="title" :left-arrow="leftArrow" @click-left="onClickLeft">
    <span slot="right" @click="onClickRight">{{rightText}}</span>
  </van-nav-bar>
</template>

<script>
import { NavBar } from 'vant'
export default {
  components: {
    [NavBar.name]: NavBar
  },
  props: {
    title: {
      type: String
    },
    rightText: {
      type: String
    },
    leftArrow: {
      type: Boolean
    }
  },
  methods: {
    onClickLeft () {
      this.$emit('goBack')
    },
    onClickRight () {
      this.$emit('complete')
    }
  }
}
</script>

<style lang="less">
  // .van-nav-bar{
  //   background-color: #1989fa;
  //   .van-icon, .van-nav-bar__title, .van-nav-bar__right{
  //     color: #fff;
  //   }
  // }
    // background-color #1989fa
    // position: fixed
    // left 0
    // top 0
    // height: 46px
    // width 100%
    // line-height: 46px
    // text-align: center
    // user-select: none
    // .van-icon, .van-nav-bar__title, .van-nav-bar__right
    //   color #fff
</style>
