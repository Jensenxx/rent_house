<template>
  <div style="width:100%;height:100%">
    <my-header :title="'地图找房'" :leftArrow="true" @goBack="$router.go(-1)"/>
    <div id='map'></div>
  </div>
</template>

<script>
import BMap from 'BMap'
import MyHeader from '../../components/common/my-header'
export default {
  components: {
    MyHeader
  },
  methods: {
    createBMap (address) {
      var map = new BMap.Map('map')
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.GeolocationControl())
      var myGeo = new BMap.Geocoder()
      myGeo.getPoint(address, function (point) {
        console.log(point)
        if (point) {
          map.centerAndZoom(point, 16)
          map.addOverlay(new BMap.Marker(point))
        }
      })
    }
  },
  mounted () {
    this.createBMap('广东省广州市')
  }
}
</script>

<style lang='less' scoped>
  #map{
    width: 100%;
    height: calc(100% - 100px);
  }
</style>
