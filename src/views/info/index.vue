<template>
  <div class="home">
    <my-header :title="'资讯'"/>
    <van-tabs v-model="active" color="#1989fa">
      <van-tab title="资讯" ><house-info></house-info></van-tab>
      <van-tab title="问答"><house-answer></house-answer></van-tab>
    </van-tabs>
    <footbar :active=1 />
  </div>
</template>

<script>
import footbar from '@/components/common/foot-bar'
import MyHeader from '@/components/common/my-header'
import houseInfo from './house-info'
import houseAnswer from './house-answer'
import { Cell, List, PullRefresh, Tab, Tabs } from 'vant'
export default {
  components: {
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    MyHeader,
    houseInfo,
    houseAnswer,
    footbar
  },
  data () {
    return {
      active: 0
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      console.log(to)
      if (to.query && [0, 1].includes(to.query.active)) {
        vm.active = Number(to.query.active)
      }
    })
  }
}
</script>
