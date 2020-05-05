<template>
  <div>
    <my-header :title="'我的'" />
    <div class="user-container">
      <p>用户: {{userInfo.userName}}</p>
      <van-button size="small" type="info" @click="edit">编辑个人信息</van-button>
    </div>
    <!-- <div class="container">
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
    </div> -->
    <!-- <van-grid :column-num="2" :gutter="20">
      <van-grid-item icon="photo-o" text="文字" /><van-icon name="newspaper-o" />
      <van-grid-item icon="photo-o" text="文字" /><van-icon name="comment-o" />
      <van-grid-item icon="photo-o" text="文字" /><van-icon name="idcard" />
      <van-grid-item icon="photo-o" text="文字" /><van-icon name="bulb-o" />
      <van-grid-item icon="photo-o" text="文字" /><van-icon name="bullhorn-o" />
    </van-grid> -->
    <van-cell-group style="margin-top: 30px">
      <van-cell title="当前发布" icon="bullhorn-o" is-link to="/mine/publish">
        <template>
          <div style="position: absolute;right:5px;top:38%;width:6px;height:6px;border-radius:50%;background:red">·</div>
        </template>
      </van-cell>
      <van-cell title="收到预约" icon="bulb-o" is-link to="/mine/appointment">
        <template>
          <div style="position: absolute;right:5px;top:38%;width:6px;height:6px;border-radius:50%;background:red">·</div>
        </template>
      </van-cell>
      <van-cell title="我的合同" icon="idcard" is-link to="/mine/contract">
        <template>
          <div style="position: absolute;right:5px;top:38%;width:6px;height:6px;border-radius:50%;background:red">·</div>
        </template>
      </van-cell>
      <van-cell title="合同请求" icon="bullhorn-o" is-link to="/mine/contractRequest">
        <template>
          <div style="position: absolute;right:5px;top:38%;width:6px;height:6px;border-radius:50%;background:red">·</div>
        </template>
      </van-cell>
      <van-cell title="我的房源" icon="newspaper-o" is-link to="/mine/minehouse">
        <template>
          <div style="position: absolute;right:5px;top:38%;width:6px;height:6px;border-radius:50%;background:red">·</div>
        </template>
      </van-cell>
    </van-cell-group>
    <footbar :active=2 />
  </div>
</template>

<script>
import footbar from '@/components/common/foot-bar'
import MyHeader from '../../components/common/my-header'
import { Button, Image as VanImage } from 'vant'
import Vue from 'vue'
Vue.use(VanImage)
export default {
  components: {
    [Button.name]: Button,
    MyHeader,
    footbar
  },
  data () {
    return {
      itemList: [
        { src: require('../../assets/images/mine/publish.png'), desc: '当前发布' },
        { src: require('../../assets/images/mine/message.png'), desc: '收到预约' },
        { src: require('../../assets/images/mine/rent.png'), desc: '当前合同' },
        { src: require('../../assets/images/mine/rent.png'), desc: '我的房源' }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    edit () {
      this.$router.push('/mine/edit')
    },
    handleClick (index) {
      index === 0 && this.$router.push('/mine/publish')
      index === 1 && this.$router.push('/mine/appointment')
      index === 2 && this.$router.push('/mine/contract')
      index === 3 && this.$router.push('/mine/minehouse')
    }
  }
}
</script>

<style lang="less" scoped>
  .user-container{
    width: 80%;
    height: 300px;
    margin: 50px auto 0;
    background: #fff;
    padding: 80px 40px;
    box-sizing: border-box;
    text-align: center;
    font-size: 16px; /*no*/
    .van-button--small{
      margin-top: 40px;
    }
  }
  .container{
    width: 100%;
    height: 200px;
    display: flex;
    margin-top: 40px;
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
</style>
