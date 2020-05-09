<template>
  <div>
    <my-header :title="'收到预约'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        @load="onLoad"
        finished-text="没有更多了"
      >
        <div class="container van-hairline--bottom" v-for="(item, index) in appointmentList" :key="index">
          <div class="right">
            <p>预约房源: {{item.houseAddress}}</p>
            <p>预约人: {{item.reservationUserName}}</p>
            <p>手机号: {{item.reservationUserMobile}}</p>
            <p>看房时间: {{item.reservationDate | formatdate}}</p>
            <van-button size="small" type="info" @click="handleClickRent(index)">确认租用</van-button>
            <van-button size="small" type="danger" class="del" @click="handleClickDel(item)">删除预约</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showDialog"
      title="租用"
      show-cancel-button
      @confirm="handleConfirmRent"
    >
      <van-field
        label="租用时长:"
        placeholder="请输入"
        v-model.number="month"
      >
        <template #button>
          <span>个月</span>
        </template>
      </van-field>
      <van-cell title="租用时间" :value="rentTime || '请选择'" is-link @click="showTime=true"></van-cell>
    </van-dialog>
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
import { Field, CellGroup, Button, Cell, DatetimePicker } from 'vant'
import { formatDate } from '../../assets/js/utils'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [DatetimePicker.name]: DatetimePicker
  },
  data () {
    return {
      showDialog: false,
      showTime: false,
      rentTime: '',
      appointmentList: [],
      currentIndex: 0,
      month: '',
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 10
    }
  },
  filters: {
    formatdate (val) {
      return formatDate(new Date(val), 'YY:MM:DD hh:mm').slice(0, -3)
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
      this.rentTime = formatDate(value, 'YY-MM-DD hh:mm').slice(0, -3)
    },
    onLoad () {
      this.getAppointmentList()
    },
    onRefresh () {
      this.currentPage = 1
      this.getAppointmentList('refresh')
    },
    getAppointmentList (type) {
      this.$api('/listReservationHouse', 'get', {
        landlordNum: this.userInfo.userNum,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        this.appointmentList = this.appointmentList.concat(res.data.datas)
        if (type === 'refresh') {
          this.appointmentList = []
          this.appointmentList = this.appointmentList.concat(res.data.datas)
        }
        this.currentPage++
        this.loading = false
        this.finished = res.data.finished
      })
    },
    handleClickRent (index) {
      this.showDialog = true
      this.currentIndex = index
    },
    handleClickDel (item) {
      console.log(item)
      this.$dialog.confirm({
        title: '提示',
        message: '确定要删除预约吗?'
      }).then(() => {
        this.$api('/deleteReservationHouse', 'get', {
          houseReservationNum: item.houseReservationNum
        }).then(res => {
          this.showToast({ msg: '已删除预约' })
          setTimeout(() => {
            this.onRefresh()
          }, 800)
        })
      })
    },
    handleConfirmRent () {
      this.$api('contractHouse', 'post', {
        effectDate: new Date(this.rentTime),
        houseReservationNum: this.appointmentList[this.currentIndex].houseReservationNum,
        landlordNum: this.userInfo.userNum,
        month: this.month,
        tenantNum: this.appointmentList[this.currentIndex].reservationUserNum
      }).then(res => {
        console.log(res)
        this.showToast({ msg: '租用成功' })
        setTimeout(() => {
          this.onRefresh()
        }, 800)
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
    height: 300px;
    background: #fff;
    display: flex;
    align-items: center;
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
        font-size: 15px; /*no*/
        line-height: 25px; /*no*/
      }
      .van-button--small{
        position: absolute;
        right: 155px;
        bottom: 15px;
      }
      .del{
        right: 10px;
      }
    }
  }
</style>
