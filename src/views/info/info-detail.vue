<template>
  <div class="info-detail">
    <my-header :title="'资讯详情'" :leftArrow="true" @goBack="$router.go(-1)"/>
    <div class="info">
      <h2>{{infoDetail.infoTitle}}</h2>
      <p style="margin-top: 20px">{{infoDetail.infoContent}}</p>
    </div>
  </div>
</template>

<script>
import MyHeader from '@/components/common/my-header'
export default {
  components: {
    MyHeader
  },
  data () {
    return {
      infoDetail: {}
    }
  },
  methods: {
    getInfoDetail () {
      this.$api('/getInfo', 'get', {
        infoNum: this.$route.params.id
      }).then(res => {
        console.log(res)
        this.infoDetail = res.data
      })
    }
  },
  mounted () {
    this.getInfoDetail()
  }
}
</script>

<style lang="less" scoped>
  .info-detail{
    .info{
      margin-top: 20px;
      background: #fff;
      h2{
        font-size: 18px; /*no*/
        font-weight: bold;
      }
      p{
        font-size: 16px; /*no*/
        line-height: 1.5;
      }
    }
  }
</style>
