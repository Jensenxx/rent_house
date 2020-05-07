<template>
  <div style="margin-bottom:50px">
    <van-button type="info" block @click="showTiwenDialog=true">快速提问</van-button>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="10"
        @load="onLoad"
        finished-text="没有更多了"
      >
        <div class="container van-hairline--bottom" v-for="(item, index) in questionList" :key="index">
          <div class="question-c">
            <h2>问题名称: {{item.questionContent}}</h2>
            <div class="answer">
              <van-button size="small" type="info" @click="handleClickAnswer(index)">回答</van-button>
            </div>
          </div>
          <div class="user-answer van-hairline--bottom" v-for="(item1, index1) in item.answerList" :key="index1">
            <p>{{item1.userName}}: {{item1.answerContent}}</p>
          </div>
          <!-- <div class="open" @click="open(index)" v-if="item.tempList.length > 2">{{ item.openFlag ? '收起' : '展开' }}</div> -->
        </div>
      </van-list>
    </van-pull-refresh>
    <van-dialog
      v-model="showDialog"
      title="回答"
      show-cancel-button
      @confirm="handleConfirm"
    >
      <van-field
        placeholder="请输入"
        autosize
        type="textarea"
        maxlength="50"
        v-model="answerContent"
      />
    </van-dialog>
    <van-dialog
      v-model="showTiwenDialog"
      title="提问"
      show-cancel-button
      @confirm="handleConfirmTiwen"
    >
      <van-field
        placeholder="请输入问题"
        autosize
        type="textarea"
        maxlength="50"
        v-model="tiwenquestion"
      />
    </van-dialog>
  </div>
</template>

<script>
import { Button, Field } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [Field.name]: Field
  },
  data () {
    return {
      mock: [],
      temp: [],
      tiwenquestion: '',
      answerContent: '',
      questionList: [],
      currentIndex: 0,
      answerList: [],
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 10,
      showDialog: false,
      showTiwenDialog: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    mockData () {
      this.mock = [
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' },
        { user: '腰还疼', answer: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好' }
      ]
      this.temp = this.mock
      this.mock = this.mock.slice(0, 2)
    },
    open (index) {
      this.questionList[index].openFlag = !this.questionList[index].openFlag
      this.questionList[index].openFlag ? this.this.questionList[index].answerList = this.questionList[index].tempList : this.questionList[index].answerList = this.questionList[index].answerList.slice(0, 2)
    },
    onLoad () {
      this.getQuestionList()
    },
    onRefresh () {
      this.currentPage = 1
      this.getQuestionList('refresh')
    },
    getQuestionList (type) {
      this.$api('/listAllQuestion', 'get', {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        this.questionList = this.questionList.concat(res.data.datas)
        if (type === 'refresh') {
          this.questionList = []
          this.questionList = this.questionList.concat(res.data.datas)
        }
        this.currentPage++
        this.loading = false
        this.finished = res.data.finished
        this.questionList.forEach((item, index) => {
          item.openFlag = false
          this.getAnswerList(item.questionNum, index)
        })
      })
    },
    getAnswerList (num, index) {
      console.log(index)
      this.$api('/listAnswerByQueNum', 'get', {
        questionNum: num,
        currentPage: 1,
        pageSize: 9999
      }).then(res => {
        console.log(res)
        const list = res.data.datas
        // list = list.concat(list).concat(list)
        this.$set(this.questionList[index], 'answerList', list)
        this.$set(this.questionList[index], 'tempList', list)
        // if (this.questionList[index].answerList.length > 2) {
        //   this.questionList[index].answerList = this.questionList[index].answerList.slice(0, 2)
        // }
        // this.questionList[index].answerList = list
      })
    },
    handleClickAnswer (index) {
      this.currentIndex = index
      this.showDialog = true
    },
    handleConfirm () {
      this.$api('/addAnswer', 'post', {
        answerContent: this.answerContent,
        userNum: this.userInfo.userNum,
        questionNum: this.questionList[this.currentIndex].questionNum
      }).then(res => {
        console.log(res)
        this.questionList.forEach((item, index) => {
          item.openFlag = false
          this.getAnswerList(item.questionNum, index)
        })
      })
    },
    handleConfirmTiwen () {
      this.$api('/addQuestion', 'post', {
        userNum: this.userInfo.userNum,
        questionContent: this.tiwenquestion
      }).then(res => {
        console.log(res)
        this.onRefresh()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .container{
    width: 100%;
    background: #fff;
    padding: 20px 20px 10px 20px;
    .question-c{
      width: 100%;
      height: 200px;
      position: relative;
      h2{
        font-size: 16px; /*no*/
        font-weight: bold;
        line-height: 1.5; /*no*/
      }
      .answer{
        width: 100px;
        height: 60px;
        position: absolute;
        right: 20px;
        bottom: 0;
      }
    }
    .user-answer{
      margin-top: 10px;
      width: 100%;
      background: #fff;
      p{
        font-size: 14px; /*no*/
        line-height: 1.5;
      }
    }
    .open{
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #1989fa;
    }
  }
</style>
