<template>
  <div class="publish">
    <my-header :title="'租房'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-cell-group>
      <van-field
        label="地址:"
        v-model="address"
        placeholder="请选择"
        required
        clickable
        is-link
        disabled
        clearable
        @click="showArea=true"
      />
      <van-field
        label="详细地址:"
        placeholder="请输入"
        required
        clearable
        v-model="condition.descAddress"
      />
      <van-cell title="面积范围" class="floor" required>
        <template>
          <input placeholder="" v-model.number="condition.minArea" maxlength="3"/>~
          <input placeholder="" v-model.number="condition.maxArea" maxlength="3"/>
          <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :options="option1" @change="handleChangeRentType" />
          </van-dropdown-menu>
        </template>
      </van-cell>
      <van-cell title="价格范围" class="floor" required>
        <template>
          <input placeholder="" v-model.number="condition.minRent" maxlength="4"/>~
          <input placeholder="" v-model.number="condition.maxRent" maxlength="4"/>
          <van-button size="small" type="info" style="margin-left: 15px" @click="handleInit">清空</van-button>
          <van-button size="small" type="info" style="margin-left: 10px" @click="onRefresh">查询</van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <van-popup v-model="showArea" position="bottom">
      <van-area
        :area-list="areaList"
        :columns-num="3"
        @confirm="hanleConfirmCity"
        @cancel="showArea=false"
      />
    </van-popup>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="10"
          @load="onLoad"
          finished-text="没有更多了"
        >
          <div class="container van-hairline--bottom" v-for="(item, index) in houseList" :key="index" @click="handleClick(item.houseNum)">
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
    <van-popup
      v-model="showAddressBaidu"
      closeable
      position="bottom"
      :style="{ height: '30%' }"
    >
      <div class="baidu-container" >
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell :title="`${item.province} - ${item.city} - ${item.district} - ${item.name}`" clickable v-for="(item, index) in areaforBaiduList" :key="index" @click="handleClickBaiduList(item)">
              <template #right-icon>
                <van-radio :name="`${item.province} - ${item.city} - ${item.district} - ${item.name}`"/>
              </template>
            </van-cell>
          </van-cell-group>
          <div style="text-align:center">
            <p v-if="!areaforBaiduList.length">暂无此记录</p>
          </div>
        </van-radio-group>
      </div>
    </van-popup>
    <van-action-sheet v-model="showActionSheet" :actions="actions" @select="handleSelect" description="请选择出行方式"/>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import areaList from '../../assets/js/area'
import BMap from 'BMap'
import { Field, CellGroup, Button, Cell, Area, Picker, DropdownMenu, DropdownItem } from 'vant'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Area.name]: Area,
    [Picker.name]: Picker,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  data () {
    return {
      areaList,
      showArea: false,
      loading: false,
      finished: false,
      areaforBaiduList: [],
      address: '',
      radio: '',
      detailAddress: '',
      showRentType: false,
      showAddressBaidu: false,
      rentTypeSelect: ['整租', '合租'],
      result: [],
      value1: 0,
      option1: [
        { text: '租赁方式', value: 0 },
        { text: '整租', value: 1 },
        { text: '合租', value: 2 }
      ],
      houseList: [],
      condition: {
        province: null, // 省
        city: null, // 市
        region: null, // 区
        descAddress: null, // 详细地址
        rentType: null, // 租赁方式
        minArea: null, // 面积范围
        maxArea: null,
        minRent: null, // 价格方位
        maxRent: null,
        xposition: null, // 精度
        yposition: null, // 维度
        currentPage: 1, // 当前页码
        pageSize: 10, // 页码大小
        ownUserNum: ''
      },
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
    handleGoBack () {
      this.$router.go(-1)
    },
    submit () {
    },
    hanleConfirmCity (value) {
      console.log(value)
      this.showArea = false
      this.condition.province = value[0].name
      this.condition.city = value[1].name
      this.condition.region = value[2].name
      this.address = value.reduce((res, item) => {
        res += item.name + ' '
        return res
      }, '')
    },
    handleInit () {
      this.address = ''
      this.condition.province = null
      this.condition.city = null
      this.condition.region = null
      this.value1 = 0
      this.condition.rentType = null
      this.condition.minArea = null
      this.condition.maxArea = null
      this.condition.minRent = null
      this.condition.maxRent = null
    },
    async onLoad () {
      await this.getLocation()
      this.getHourseList()
    },
    onRefresh () {
      this.condition.currentPage = 1
      this.getHourseList('refresh')
    },
    handleClick (id) {
      this.$router.push(`/home/houseDetail/${id}`)
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
    handleClickClose () {
      this.getLocation()
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
    },
    handleChangeRentType (value) {
      const arr = ['', '整租', '合租']
      this.condition.rentType = arr[value]
      console.log(value)
    }
  },
  mounted () {
    // this.getLocation()
    // this.condition.xposition = 113.30764968 // res.data.content.point.x
    // this.condition.yposition = 23.12004910 // res.data.content.point.y
  }
}
</script>

<style lang="less" scoped>
  .floor{
    .van-cell__title{
    }
    .van-cell__value {
      flex: 200px; /*no*/
      text-align: left;
      display: flex;
      align-items: center;
      input{
        width: 50px; /*no*/
        color: #000;
        text-align:center;
        margin-right: 10px;
        &:not(:first-child){
          margin-left: 10px;
        }
      }
      .van-checkbox{
        margin-top:15px;
      }
      .van-dropdown-menu {
        height: 20px; /*no*/
      }
    }
  }
  .baidu-container{
    width: 100%;
    height: 80%;
    margin-top: 100px;
    overflow: scroll;
    padding: 0 40px;
    p{
      font-size: 16px; /*no*/
    }
  }
  .container{
    width: 100%;
    height: 400px;
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
