<template>
  <div>
    <!-- <van-field
      v-model="search"
      right-icon="search"
      placeholder="搜房源..."
    /> -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <div class="container van-hairline--top van-hairline--bottom">
      <div class="wrap" v-for="(item, index) in itemList" :key="index">
        <div @click="handleClick(index)">
          <van-image
            round
            width="1.33rem"
            height="1.33rem"
            fit="fill"
            :src="item.src"
          />
          <p>{{item.desc}}</p>
        </div>
      </div>
    </div>

    <van-cell title="最新房源" value="" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="10"
          @load="onLoad"
          finished-text="没有更多了"
        >
          <div class="house-container van-hairline--bottom" v-for="(item, index) in houseList" :key="index" @click="$router.push(`/home/houseDetail/${item.houseNum}`)">
            <div class="left">
              <img :src="item.photosAddress.split(',')[0]" alt="">
            </div>
            <div class="right">
              <h2>{{item.houseTitle}}</h2>
              <p>楼层: {{item.floor}}/{{item.allFloor}}, 面积: {{item.area}} 平方</p>
              <p>户型: {{item.unitType}}</p>
              <p>地址: {{item.address}}</p>
              <p>租金: {{item.rent}}/月</p>
              <p>距离: {{item.length}}公里</p>
              <van-button size="small" type="info" @click.stop="handleClickBtn(index)">到这里</van-button>
            </div>
          </div>
        </van-list>
    </van-pull-refresh>
    <footbar :active=0 />
    <van-action-sheet v-model="showActionSheet" :actions="actions" @select="handleSelect" description="请选择出行方式"/>
  </div>
</template>

<script>
import footbar from '@/components/common/foot-bar'
import Vue from 'vue'
import BMap from 'BMap'
import { Cell, List, PullRefresh, Field, Swipe, SwipeItem, Lazyload, Image as VanImage } from 'vant'
Vue.use(Lazyload)
Vue.use(VanImage)
export default {
  components: {
    [Cell.name]: Cell,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Field.name]: Field,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    footbar
  },
  data () {
    return {
      search: '',
      images: [
        'http://lijy.oss-cn-shenzhen.aliyuncs.com/images/2020/05/08/15889248109216230.jpg',
        'http://lijy.oss-cn-shenzhen.aliyuncs.com/images/2020/05/08/15889251339947359.jpg',
        'http://lijy.oss-cn-shenzhen.aliyuncs.com/images/2020/05/08/1588925173467185.jpg'
      ],
      itemList: [
        { src: require('../../assets/images/home/map.png'), desc: '地图找房' },
        { src: require('../../assets/images/home/house.png'), desc: '租房' },
        { src: require('../../assets/images/home/publish.png'), desc: '发布房源' },
        { src: require('../../assets/images/home/answer.png'), desc: '问答' }
      ],
      loading: false,
      finished: false,
      condition: {
        xposition: 113.30764968, // 精度
        yposition: 23.1200491, // 维度
        currentPage: 1, // 当前页码
        pageSize: 10, // 页码大小
        ownUserNum: ''
      },
      houseList: [],
      showActionSheet: false,
      currentIndex: 0,
      actions: [
        { name: '公交' },
        { name: '自驾' }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    handleClick (index) {
      index === 0 && this.$router.push('/home/maphouse')
      index === 1 && this.$router.push('/home/rent')
      index === 2 && this.$router.push('/mine/minehouse')
      index === 3 && this.$router.push({
        path: '/info',
        query: {
          active: 1
        }
      })
    },
    async onLoad () {
      await this.getLocation()
      this.getHourseList()
    },
    onRefresh () {
      this.condition.currentPage = 1
      this.getHourseList('refresh')
    },
    getHourseList (type) {
      this.condition.ownUserNum = this.userInfo.userNum
      this.$api('/getConditionHouse', 'post', this.condition).then(res => {
        console.log(res)
        res.data.resultHouses === null && (res.data.resultHouses = [])
        this.houseList = this.houseList.concat(res.data.resultHouses)
        type === 'refresh' && (this.houseList = (res.data.resultHouses))
        this.condition.currentPage++
        this.loading = false
        this.finished = true
      })
    },
    getLocation () {
      return new Promise(resolve => {
        var geolocation = new BMap.Geolocation()
        var self = this
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() === 0) {
            console.log(r.point)
            self.condition.xposition = r.point.lng
            self.condition.yposition = r.point.lat
            resolve()
          } else {
            alert('failed' + this.getStatus())
          }
        }, { enableHighAccuracy: true })
      })
    },
    handleClickBtn (index) {
      this.currentIndex = index
      this.showActionSheet = true
    },
    handleSelect (val) {
      console.log(val.name)
      this.showActionSheet = false
      val.name === '公交' && setTimeout(() => {
        this.$router.push({ path: '/home/navmaphousebus', query: { data: this.houseList[this.currentIndex] } })
      }, 800)
      val.name === '自驾' && setTimeout(() => {
        this.$router.push({ path: '/home/navmaphouse', query: { data: this.houseList[this.currentIndex] } })
      }, 800)
    }
  }
}
</script>

<style lang="less" scoped>
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    text-align: center;
    background-color: #39a9ed;
    height: 400px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .container{
    width: 100%;
    height: 200px;
    display: flex;
    background: #fff;
    .wrap{
      flex: 1;
      height: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      p{
        margin-top: 15px;
      }
    }
  }
  .house-container{
    width: 100%;
    height: 380px;
    background: #fff;
    display: flex;
    align-items: center;
    .left{
      width: 300px;
      height: 250px;
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
        right: 30px;
        bottom: 15px;
      }
    }
  }
</style>
