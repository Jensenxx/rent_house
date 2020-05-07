<template>
  <div style="width:100%; height:100%">
    <my-header :title="'我的合同'" :leftArrow="true" @goBack="handleGoBack"/>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        @load="onLoad"
        finished-text="没有更多了"
      >
        <div class="container van-hairline--bottom"  v-for="(item, index) in contractList" :key="index">
          <div class="right" @click="handleClickContract(item)" >
            <p>合同编号: {{item.contractNum}}</p>
            <p>出租人: {{item.landlordName}}</p>
            <p>承租人: {{item.tenantName}}</p>
            <p>生效时间: {{item.effectTime | formatItemDate}}</p>
            <p>租用时长: {{item.monthNum}}月</p>
            <p>房源地址: {{item.houseAddress.replace(/\{|\}/g, '')}} </p>
            <van-button size="small" type="info" @click.stop="handleContinueContract(index)">续约</van-button>
            <van-button size="small" type="danger" class="cancel" @click.stop="endContract(item)">解约</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showDialog"
      title="续约"
      show-cancel-button
      @confirm="handleConfirm"
    >
      <van-field
        label="租用时长:"
        placeholder="请输入"
        v-model.number="durationMonth"
      >
        <template #button>
          <span>个月</span>
        </template>
      </van-field>
    </van-dialog>
    <van-overlay :show="showContract" @click="showContract = false">
      <div class="pdf-wrap" v-if="showContract">
        <pdf :src="pdfSrc"></pdf>
        <div>{{contract.telnantName}}</div>
        <div>{{contract.telnantIdNum}}</div>
        <div>{{contract.landlordName}}</div>
        <div>{{contract.landlordIdNum}}</div>
        <div>{{contract.province.slice(0, -1)}}</div>
        <div>{{contract.city.slice(0, -1)}}</div>
        <div>{{contract.regin.slice(0, -1)}}</div>
        <div>{{contract.buildings}}</div>
        <div>{{contract.unit}}</div>
        <div>{{contract.area}}</div>
        <div>{{contract.beginDate.year}}</div>
        <div>{{contract.beginDate.month}}</div>
        <div>{{contract.beginDate.date}}</div>
        <div>{{contract.endDate.year}}</div>
        <div>{{contract.endDate.month}}</div>
        <div>{{contract.endDate.date}}</div>
        <div>{{contract.telnantName}}</div>
        <div>{{contract.telnantPhontNum}}</div>
        <div>{{contract.beginDate.year}}</div>
        <div>{{contract.beginDate.month}}</div>
        <div>{{contract.beginDate.date}}</div>
        <div>{{contract.landlordName}}</div>
        <div>{{contract.landlordPhoneNum}}</div>
        <div>{{contract.beginDate.year}}</div>
        <div>{{contract.beginDate.month}}</div>
        <div>{{contract.beginDate.date}}</div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import { Field, CellGroup, Button } from 'vant'
import { formatDate } from '../../assets/js/utils'
import pdf from 'vue-pdf'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    pdf
  },
  data () {
    return {
      showDialog: false,
      pdfSrc: './contract.pdf',
      showContract: false,
      contractList: [],
      contract: {},
      currentIndex: 0,
      durationMonth: '',
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 10
    }
  },
  filters: {
    formatItemDate (item) {
      return formatDate(new Date(item))
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
    onLoad () {
      this.getContractList()
    },
    onRefresh () {
      this.currentPage = 1
      this.getContractList('refresh')
    },
    getContractList (type) {
      this.$api('/listHouseContract', 'get', {
        userNum: this.userInfo.userNum,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res)
        this.contractList = this.contractList.concat(res.data.datas)
        if (type === 'refresh') {
          this.contractList = []
          this.contractList = this.contractList.concat(res.data.datas)
        }
        this.currentPage++
        this.loading = false
        this.finished = res.data.finished
      })
    },
    endContract (item) {
      let flag = false
      this.$api('countContractRequest', 'get', {
        houseContractNum: this.contractList[this.currentIndex].contractNum
      }).then(res => {
        console.log(res)
        if (res.data !== 0) {
          this.showToast({ msg: '当前已申请该合同请求, 请等待' })
          flag = true
        }
      })
      if (flag) {
        return
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确定要解约吗?'
      }).then(() => {
        this.$api('/endContract', 'get', {
          houseContractNum: item.contractNum,
          requestType: 'jieyue',
          userNum: this.userInfo.userNum,
          xuyueTime: 0
        }).then(res => {
          this.showToast({ msg: '解约成功' })
          setTimeout(() => {
            this.getContractList()
          }, 800)
        })
      })
    },
    handleContinueContract (index) {
      this.currentIndex = index
      this.$api('countContractRequest', 'get', {
        houseContractNum: this.contractList[this.currentIndex].contractNum
      }).then(res => {
        console.log(res)
        if (res.data === 0) {
          this.showDialog = true
        } else {
          this.showToast({ msg: '当前已申请该合同请求, 请等待' })
        }
      })
    },
    handleConfirm () {
      console.log(this.contractList[this.currentIndex], this.durationMonth)
      if (!this.durationMonth) {
        this.showToast({ msg: '请填写完整' })
        return
      }
      this.$api('/continueContract', 'get', {
        houseContractNum: this.contractList[this.currentIndex].contractNum,
        requestType: 'xuyue',
        userNum: this.userInfo.userNum,
        xuyueTime: this.durationMonth
      }).then(res => {
        console.log(res)
        this.showToast({ msg: '已发起续约申请,请等待' })
        this.onRefresh()
      })
    },
    handleClickContract (item) {
      this.$api('/readHouseContract', 'get', {
        houseContractNum: item.contractNum
      }).then(res => {
        console.log(res)
        this.showContract = true
        this.contract = res.data
        const beginDate = new Date(this.contract.beginDate)
        const endDate = new Date(this.contract.beginDate)
        this.contract.beginDate = {
          year: beginDate.getFullYear(),
          month: beginDate.getMonth() + 1,
          date: beginDate.getDate()
        }
        this.contract.endDate = {
          year: endDate.getFullYear(),
          month: endDate.getMonth() + 1,
          date: endDate.getDate()
        }
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
    height: 420px;
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
        right: 20px;
        top: 40px;
      }
      .cancel{
        top: 150px;
      }
    }
  }
  .pdf-wrap{
    width: 100%;
    height: 100%;
    position: relative;
    &:first-child{
      position: absolute;
      display: block;
      top: 40%;
      margin-top: -50%;
    }
    div{
      position: absolute;
      z-index: 99999;
      top: 125px;
      left: 240px;
      font-size: 12px; /*no*/
      transform: scale(0.6);
      &:nth-child(3){
        left: 360px;
      }
      &:nth-child(4){
        top: 165px;
        left: 220px
      }
      &:nth-child(5){
        top: 165px;
        left: 360px;
      }
      &:nth-child(6){
        top: 245px;
        left: 200px;
      }
      &:nth-child(7){
        top: 245px;
        left: 245px;
      }
      &:nth-child(8){
        top: 245px;
        left: 300px;
      }
      &:nth-child(9){
        top: 245px;
        left: 400px;
      }
      &:nth-child(10){
        top: 245px;
        left: 600px;
      }
      &:nth-child(11){
        top: 268px;
        left: 220px;
      }
      &:nth-child(12){
        top: 757px;
        left: 185px;
      }
      &:nth-child(13){
        top: 757px;
        left: 250px;
      }
      &:nth-child(14){
        top: 757px;
        left: 300px;
      }
      &:nth-child(15){
        top: 757px;
        left: 400px;
      }
      &:nth-child(16){
        top: 757px;
        left: 480px;
      }
      &:nth-child(17){
        top: 757px;
        left: 520px;
      }
      &:nth-child(18){
        top: 815px;
        left: 220px;
      }
      &:nth-child(19){
        top: 855px;
        left: 200px;
      }
      &:nth-child(20){
        top: 895px;
        left: 200px;
      }
      &:nth-child(21){
        left: 270px;
        top: 895px;
      }
      &:nth-child(22){
        left: 310px;
        top: 895px;
      }
      &:nth-child(23){
        top: 815px;
        left: 520px;
      }
      &:nth-child(24){
        top: 855px;
        left: 500px;
      }
      &:nth-child(25){
        top: 895px;
        left: 476px;
      }
      &:nth-child(26){
        left: 535px;
        top: 895px;
      }
      &:nth-child(27){
        left: 580px;
        top: 895px;
      }
    }
  }
</style>
