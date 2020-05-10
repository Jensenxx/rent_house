<template>
  <div style="width:100%;height:100%;overflow:hidden;position:relative">
    <my-header :title="'驾车路线'" :leftArrow="true" @goBack="$router.go(-1)"/>
    <div id='map'></div>
    <div class="way" ref="way" @touchmove="handleTouchMove">
      <div class="waycontainer" >
        <div :class="{'active': active === 0}" class="van-hairline--right" @click="handleClickMinTime">最少时间</div>
        <div :class="{'active': active === 1}" class="van-hairline--right" @click="handleClickShortDistance">最短距离</div>
        <div :class="{'active': active === 2}" class="van-hairline--right" @click="handleClickAvoidHigtway">避开高速</div>
      </div>
      <div class="info" @touchmove.stop>
        <div v-for="(item, index) in info" :key="index" v-html="item"></div>
      </div>
    </div>
  </div>
</template>

<script>
import BMap from 'BMap'
import MyHeader from '../../components/common/my-header'
export default {
  components: {
    MyHeader
  },
  data () {
    return {
      position: {},
      destPosition: {},
      active: 0,
      top: 85,
      info: []
    }
  },
  methods: {
    createBMap (way = 0) {
      var map = new BMap.Map('map')
      map.enableScrollWheelZoom(true)
      map.addControl(new BMap.NavigationControl({ offset: new BMap.Size(25, 680) }))
      const self = this
      const options = {
        renderOptions: { map, panel: 'r-result', autoViewport: true },
        policy: way,
        onSearchComplete (res) {
          const plan = res.getPlan(0)
          const route = plan.getRoute(0)
          console.log(route)
          self.info = route.$r.map(item => item.ml.replace(/<[^<>]+>/g, ''))
        }
      }
      var driving = new BMap.DrivingRoute(map, options)
      const start = new BMap.Point(this.position.lng, this.position.lat)
      const end = new BMap.Point(this.destPosition.lng, this.position.lat)
      driving.search(start, end)
    },
    getLocation () {
      var geolocation = new BMap.Geolocation()
      var self = this
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === 0) {
          console.log(r.point)
          self.position.lng = r.point.lng
          self.position.lat = r.point.lat
          self.createBMap()
        } else {
          alert('failed' + this.getStatus())
        }
      }, { enableHighAccuracy: true })
    },
    handleClickMinTime () {
      this.active = 0
      this.createBMap(0)
    },
    handleClickShortDistance () {
      this.active = 1
      this.createBMap(1)
    },
    handleClickAvoidHigtway () {
      this.active = 2
      this.createBMap(2)
    },
    handleTouchMove (e) {
      const dom = this.$refs.way
      dom.style.top = `${e.touches[0].clientY < 450 ? 450 : e.touches[0].clientY}px`
      dom.style.top = `${e.touches[0].clientY > 650 && 650}px`
    }
  },
  mounted () {
    this.getLocation()
    console.log(this.$route)
    this.destPosition.lng = this.$route.query.data.xposition
    this.destPosition.lat = this.$route.query.data.yposition
  }
}
</script>

<style lang='less' scoped>
  #map{
    width: 100%;
    height: calc(100% - 100px);
  }
  .way{
    width: 100%;
    height: 800px;
    position: absolute;
    top: 85%;
    background: #fff;
    .waycontainer{
      display: flex;
      width: 100%;
      height: 200px;
      div{
        flex: 1;
        text-align: center;
        line-height: 200px;
        font-size: 18px; /*no*/
      }
      .active{
        color: #1989fa
      }
    }
    .info{
      width: 100%;
      height: 480px;
      padding: 20px;
      overflow: scroll;
      div{
        font-size: 16px; /*no*/
        line-height: 22px; /*no*/
      }
    }
  }
</style>
