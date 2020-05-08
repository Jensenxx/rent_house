<template>
  <div style="width:100%; height:100%">
    <my-header :title="'合同请求'" :leftArrow="true" @goBack="handleGoBack"/>
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
            <p>请求类型: {{item.requestType}}</p>
            <p>合同编号: {{item.houseContractNum}}</p>
            <p>房源地址: {{item.houseAddress}}</p>
            <p>请求人: {{item.requestPersonName}}</p>
            <p>合同到期时间: {{item.contractExpireDate | formatItemDate}}</p>
            <van-button size="small" type="info" @click.stop="handleAgreeRequest(item)">同意</van-button>
            <van-button size="small" type="danger" class="cancel" @click.stop="handleRejectRequest(item)">不同意</van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import { Field, CellGroup, Button } from 'vant'
import { formatDate } from '../../assets/js/utils'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
  data () {
    return {
      contractList: [],
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
      this.$api('/listContractRequest', 'get', {
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
    handleAgreeRequest (item) {
      this.$api('/agreeContractRequest', 'get', {
        houseContractNum: item.houseContractNum
      }).then(res => {
        this.showToast({ msg: '已同意请求' })
        setTimeout(() => {
          this.onRefresh()
        }, 800)
      })
    },
    handleRejectRequest (item) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要不同意该请求吗?'
      }).then(() => {
        this.$api('/rejectContractRequest', 'get', {
          houseContractNum: item.houseContractNum
        }).then(res => {
          this.showToast({ msg: '已拒绝该请求' })
          setTimeout(() => {
            this.onRefresh()
          }, 800)
        })
      })
    },
    handleContinueContract (index) {
      this.currentIndex = index
      this.showDialog = true
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  .container{
    width: 100%;
    height: 340px;
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
        right: 160px;
        bottom: 20px;
      }
      .cancel{
        right: 20px;
      }
    }
  }

</style>
