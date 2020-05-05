<template>
  <div>
    <my-header :title="'我的房源'" :leftArrow="true" @goBack="handleGoBack"/>
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
            <img src="https://img.yzcdn.cn/vant/apple-1.jpg" alt="">
          </div>
          <div class="right">
            <h2>{{item.houseTitle}}</h2>
            <p>楼层: {{item.floor}}/{{item.allFloor}}, 面积: {{item.area}} 平方</p>
            <p>户型: {{item.unitType}}</p>
            <p>地址: {{`${item.province}${item.city}${item.region}${item.descAddress}${item.building}栋${item.unit}单元`}}</p>
            <p>租金: {{item.rent}}/月</p>
            <van-button size="small" type="info" class="publish" :disabled="item.flag" @click="publishHourse(item)">发布</van-button>
            <van-button size="small" type="danger" @click="handleDel(item)">删除</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="mybtn" @click="handleAddhouse">添加房源</div>
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
      publishedHouseList: [],
      loading: false,
      finished: false,
      currentPagePublished: 1,
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
    handleAddhouse () {
      this.$router.push('/mine/publishhouse')
    },
    onLoad () {
      this.canClickPublish()
    },
    onRefresh () {
      this.currentPage = 1
      this.currentPagePublished = 1
      this.canClickPublish('refresh')
    },
    getHouse (type) {
      return new Promise(resolve => {
        this.$api('/listHouses', 'get', {
          userNum: this.userInfo.userNum,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          this.houseList = this.houseList.concat(res.data.datas)
          if (type === 'refresh') {
            this.houseList = []
            this.houseList = this.houseList.concat(res.data.datas)
          }
          this.currentPage++
          this.loading = false
          this.finished = res.data.finished
          this.houseList.forEach(item => {
            item.flag = this.publishedHouseList.some(item1 => { return item1.houseNum === item.houseNum })
          })
          resolve()
        })
      })
    },
    getPublishedHouse (type) {
      return new Promise(resolve => {
        this.$api('/listReleaseHouses', 'get', {
          landlordNum: this.userInfo.userNum,
          currentPage: this.currentPagePublished,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          this.publishedHouseList = this.publishedHouseList.concat(res.data.datas)
          if (type === 'refresh') {
            this.publishedHouseList = []
            this.publishedHouseList = this.publishedHouseList.concat(res.data.datas)
          }
          this.currentPagePublished++
          this.loading = false
          this.finished = res.data.finished
          resolve()
        })
      })
    },
    async canClickPublish (type) {
      await this.getPublishedHouse(type)
      await this.getHouse(type)
    },
    publishHourse (item) {
      this.$api('releaseHouse', 'get', {
        houseNum: item.houseNum,
        landlordNum: item.ownUserNum
      }).then(res => {
        console.log(res)
        this.showToast({ msg: '发布成功' })
        this.onRefresh()
      })
    },
    handleDel (item) {
      this.$dialog.confirm({
        title: '提示',
        message: '删除后同时会删除已发布的该房源, 确定要删除吗?'
      }).then(() => {
        this.$api('/deleteHouse', 'get', {
          houseNum: item.houseNum
        }).then(res => {
          this.showToast({ msg: '删除成功' })
          setTimeout(() => {
            this.onRefresh()
          }, 800)
        })
      })
    }
  },
  mounted () {
    // this.canClickPublish()
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
      position: relative;
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
      .van-button--small{
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
      .publish{
        bottom: 100px;
      }
    }
  }
  .mybtn{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 46px; /*no*/
    background: #1989fa;
    color: #fff;
    font-size: 16px; /*no*/
    text-align: center;
    line-height: 46px; /*no*/
  }
</style>
