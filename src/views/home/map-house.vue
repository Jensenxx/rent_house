<template>
  <div style="width:100%;height:100%">
    <my-header :title="'地图找房'" :leftArrow="true" @goBack="$router.go(-1)"/>
    <baidu-map id="map" :zoom="zoom" @ready="handler" :center="center">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-marker :position="center"></bm-marker>
      <bm-marker :position="{lng: item.xPosition, lat: item.yPosition}" v-for="(item, index) in houseList" :key="index" @click="handleClick(item)">
        <bm-label :content="item.houseTitle" :labelStyle="{color: '#000', fontSize : '12px'}" :offset="{width: -35, height: 30}"/>
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
export default {
  components: {
    MyHeader
  },
  data () {
    return {
      center: '',
      zoom: 13,
      houseList: [],
      active: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handler ({ BMap, map }) {
      const geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition((r) => {
        console.log(r)
        this.center = { lng: r.longitude, lat: r.latitude }
      }, { enableHighAccuracy: true })
    },
    handleClick (item) {
      console.log(item)
      this.$router.push(`/home/houseDetail/${item.houseNum}`)
    },
    getHouseList () {
      this.$api('/listAllHouse', 'get', {
        userNum: this.userInfo.userNum
      }).then(res => {
        console.log(res)
        this.houseList = res.data
      })
    }
  },
  mounted () {
    this.getHouseList()
  }
}
</script>

<style lang='less' scoped>
  #map{
    width: 100%;
    height: calc(100% - 100px);
  }
</style>
