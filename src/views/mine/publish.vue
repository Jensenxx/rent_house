<template>
  <div>
    <my-header :title="'当前发布'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        @load="onLoad"
        finished-text="没有更多了"
      >
        <div class="container van-hairline--bottom" v-for="item in houseList" :key="item.id">
          <div class="left">
            <img :src="item.photosAddress.split(',')[0]" alt="">
          </div>
          <div class="right">
            <h2>{{item.houseTitle}}</h2>
            <p>楼层: {{item.floor}}/{{item.allFloor}}, 面积: {{item.area}} 平方</p>
            <p>户型: {{item.unitType}}</p>
            <p>地址: {{`${item.province}${item.city}${item.region}${item.descAddress}${item.building}栋${item.unit}单元`}}</p>
            <p>租金: {{item.rent}}/月</p>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import { Field, CellGroup, Button } from 'vant'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
  data () {
    return {
      houseList: [],
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handleGoBack () {
      this.$router.go(-1)
    },
    submit () {
    },
    onLoad () {
      this.getHouse()
    },
    onRefresh () {
      this.currentPage = 1
      this.getHouse('refresh')
    },
    getHouse (type) {
      this.$api('/listReleaseHouses', 'get', {
        landlordNum: this.userInfo.userNum,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        // res.data.datas.forEach(item => {
        //   item.photosAddress = item.photosAddress.split(',')
        // })
        this.houseList = this.houseList.concat(res.data.datas)
        if (type === 'refresh') {
          this.houseList = []
          this.houseList = this.houseList.concat(res.data.datas)
        }
        this.currentPage++
        this.loading = false
        this.finished = res.data.finished
        this.houseList = this.houseList.reduce((res, item) => {
          item !== null && res.push(item)
          return res
        }, [])
      })
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .container{
    width: 100%;
    height: 400px;
    background: #fff;
    display: flex;
    align-items: center;
    .left{
      width: 350px;
      height: 320px;
      padding: 15px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .right{
      width: 100%;
      height: 100%;
      padding: 40px 20px;
      h2{
        font-size: 16px; /*no*/
        font-weight: bold;
      }
      p{
        font-size: 14px; /*no*/
        line-height: 25px; /*no*/
        &:first-child{
          margin-top: 5px;
        }
      }
    }
  }
</style>
