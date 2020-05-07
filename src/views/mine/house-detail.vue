<template>
  <div class="house-detail">
    <my-header :title="'预约看房'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-cell-group>
      <van-cell title="标题" :value="houseDetail.houseTitle"></van-cell>
      <van-cell title="地址" :value="houseDetail.province + houseDetail.city + houseDetail.region + houseDetail.descAddress"></van-cell>
      <van-cell title="楼层" :value="`${houseDetail.floor}/${houseDetail.allFloor}`"></van-cell>
      <van-cell title="面积" :value="houseDetail.area"></van-cell>
      <van-cell title="户型" :value="houseDetail.unitType"></van-cell>
      <van-cell title="配套设施" :value="houseDetail.supportingFacilities"></van-cell>
      <van-cell title="租赁方式" :value="houseDetail.rentType"></van-cell>
      <van-cell title="租金" :value="`${houseDetail.rent}/月`"></van-cell>
      <van-cell title="房源描述" :value="houseDetail.houseDesc"></van-cell>
      <van-cell title="联系人" :value="houseDetail.contactPerson"></van-cell>
      <van-cell title="手机" :value="houseDetail.phoneNum"></van-cell>
      <img v-gallery:groupName :src="item" alt="" srcset="" v-for="(item, index) in houseDetail.photosAddress" :key="index">
      <!-- <van-uploader
        multiple
        :max-count="5"
        :show-upload="false"
        v-model="fileList"
      /> -->
      <!-- <van-cell title="选择看房时间" :value="bookTime || '请选择'" is-link @click="showTime=true"></van-cell> -->
      <!-- <van-button type="info" size="small" style="margin:30px 0 30px 50%;transform: translate(-50%,0);" @click="submit">提交</van-button> -->
    </van-cell-group>
    <van-popup v-model="showTime" position="bottom">
      <van-datetime-picker
        type="datetime"
        :min-date="new Date()"
        @cancel="showTime=false"
        @confirm="handleConfirmTime"
      />
    </van-popup>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import { Field, CellGroup, Button, Cell, Area, Picker, DatetimePicker } from 'vant'
import { formatDate } from '../../assets/js/utils'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [Area.name]: Area,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker
  },
  data () {
    return {
      showTime: false,
      bookTime: '',
      houseDetail: {},
      fileList: []
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
    handleConfirmTime (value) {
      console.log(value)
      this.showTime = false
      this.bookTime = formatDate(value, 'YY-MM-DD hh:mm').slice(0, -3)
    },
    getHouseDetail () {
      console.log(this.$route)
      this.$api('/getHouse', 'get', {
        houseNum: this.$route.params.id
      }).then(res => {
        console.log(res)
        res.data.photosAddress = res.data.photosAddress.split(',')
        // res.data.photosAddress.forEach(item => {
        //   this.toBase64(item)
        // })
        this.fileList = res.data.photosAddress
        this.houseDetail = res.data
      })
    },
    toBase64 (src) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 1440
      canvas.height = 1080
      const img = document.createElement('img')
      // img.setAttribute('crossOrigin', 'Anonymous')
      img.src = src
      const self = this
      context.drawImage(img, 0, 0, 1440, 1080)
      console.log(canvas.toDataURL('image/jpeg', 0.5))
      self.fileList.push({
        content: canvas.toDataURL('image/jpeg', 0.8)
      })
      // img.onload = function () {
      //   context.drawImage(img, 0, 0, 1440, 1080)
      //   console.log(canvas.toDataURL('image/jpeg', 0.5))
      //   self.fileList.push({
      //     content: canvas.toDataURL('image/jpeg', 0.8)
      //   })
      // }
    },
    submit () {
      this.$api('/reservationHouse', 'post', {
        houseNum: this.houseDetail.houseNum,
        landlordNum: this.houseDetail.ownUserNum,
        reservationDate: new Date(this.bookTime),
        tenantNum: this.userInfo.userNum
      }).then(res => {
        console.log(res)
        this.showToast({ msg: '预约成功' })
      })
    }
  },
  mounted () {
    this.getHouseDetail()
  }
}
</script>

<style lang="less" scoped>
  .house-detail{
    img{
      width: 300px;
      height: 300px;
      &:not(:first-child){
        margin-left: 20px;
      }
    }
  }
</style>
