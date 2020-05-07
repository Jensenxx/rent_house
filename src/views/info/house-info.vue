<template>
  <div>
    <van-button type="info" block @click="showDialog=true">发表咨询</van-button>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        @load="onLoad"
        finished-text="没有更多了"
      >
        <div class="container van-hairline--bottom" v-for="(item, index) in infoList" :key="index" @click="$router.push(`/infoDetail/${item.infoNum}`)">
          <h2>{{item.infoTitle}}</h2>
          <!-- <p class="van-multi-ellipsis--l3">{{item.userId}}</p> -->
        </div>
      </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showDialog"
      title="发表咨询"
      show-cancel-button
      @confirm="handleConfirm"
    >
      <van-field
        placeholder="请输入咨询标题"
        autosize
        type="textarea"
        maxlength="20"
        show-word-limit
        v-model="infoTitle"
      />
      <van-field
        placeholder="请输入咨询详情"
        autosize
        type="textarea"
        maxlength="50"
        show-word-limit
        v-model="infoContent"
      />
    </van-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      infoList: [],
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 10,
      showDialog: false,
      infoTitle: '',
      infoContent: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    onLoad () {
      this.getInfoList()
    },
    onRefresh () {
      this.currentPage = 1
      this.getInfoList('refresh')
    },
    getInfoList (type) {
      this.$api('/listAllInfo', 'get', {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.infoList = this.infoList.concat(res.data.datas)
        if (type === 'refresh') {
          this.infoList = []
          this.infoList = this.infoList.concat(res.data.datas)
        }
        this.currentPage++
        this.loading = false
        this.finished = res.data.finished
      })
    },
    handleConfirm () {
      this.$api('/addInfo', 'post', {
        infoContent: this.infoContent,
        infoTitle: this.infoTitle,
        userNum: this.userInfo.userNum
      }).then(res => {
        this.onRefresh()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .container{
    width: 100%;
    height: 250px;
    background: #fff;
    padding: 20px 20px 10px 20px;
    h2{
      font-size: 16px; /*no*/
      font-weight: bold;
    }
    p{
      color: #9b9b9b;
      margin-top: 20px;
      font-size: 14px; /*no*/
      line-height: 16px; /*no*/
    }
  }
</style>
