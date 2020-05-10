<template>
  <div>
    <my-header :title="'注册'" :leftArrow="true" @goBack="$router.go(-1)"/>
    <van-cell-group>
      <van-field v-model="userId" placeholder="请输入登录名" />
      <van-field v-model="password" placeholder="请输入密码" />
      <van-field v-model="phoneNum" placeholder="请输入手机号码" />
      <van-field v-model="userName" placeholder="请输入姓名" />
      <van-field v-model="idNum" placeholder="请输入身份证" />
      <van-button type="info" block @click="handleClick">提交</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import MyHeader from '@/components/common/my-header'
export default {
  components: {
    MyHeader
  },
  data () {
    return {
      userId: '',
      password: '',
      phoneNum: '',
      userName: '',
      idNum: ''
    }
  },
  methods: {
    handleClick () {
      if (!this.userId || !this.password || !this.phoneNum || !this.userName || !this.idNum) {
        this.showToast({ msg: '请填写完整' })
        return
      }
      this.$api('/createUser', 'post', {
        userId: this.userId,
        password: this.password,
        phoneNum: this.phoneNum,
        userName: this.userName,
        idNum: this.idNum
      }).then(res => {
        this.showToast({ msg: '注册成功' })
        setTimeout(() => {
          this.$store.commit('setUserInfo', res.data)
          this.$router.push('/home')
        }, 800)
      })
    }
  }
}
</script>

<style>
</style>
