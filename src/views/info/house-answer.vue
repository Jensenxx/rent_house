<template>
  <div style="margin-bottom:50px">
    <van-button type="info" block>快速提问</van-button>
    <div class="container van-hairline--bottom">
      <div class="question-c">
        <h2>问题名称: 问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题问题</h2>
        <div class="answer">
          <van-button size="small" type="info" @click="showDialog=true">回答</van-button>
        </div>
      </div>
      <div class="user-answer van-hairline--bottom" v-for="(item, index) in mock" :key="index">
        <p>腰还疼: 很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好很好</p>
      </div>
      <div class="open" @click="open" v-if="temp.length > 2">{{ openFlag ? '收起' : '展开' }}</div>
    </div>
    <van-dialog
      v-model="showDialog"
      title="回答"
      show-cancel-button
    >
      <van-field
        placeholder="请输入"
        autosize
        type="textarea"
        maxlength="50"
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
      openFlag: false,
      showDialog: false
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
    open () {
      this.openFlag = !this.openFlag
      this.openFlag ? this.mock = this.temp : this.mock = this.mock.slice(0, 2)
    }
  },
  mounted () {
    this.mockData()
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
