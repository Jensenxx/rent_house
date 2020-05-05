/* eslint-disable */
<template>
  <div class="login-wrap">
    <img alt="Vue logo" src="../assets/logo.png">
    <van-cell-group>
      <van-field
        label="账号:"
        maxlength="11"
        required
        clearable
        v-model="user_name"
      />
      <van-field
        label="密码:"
        maxlength="13"
        type="password"
        required
        v-model="user_pwd"
      />
    </van-cell-group>

  <van-row  type="flex" justify="space-around" style="margin:15px 0">
    <van-col  span="10"><van-checkbox v-model="remember_user" @click="rememberUserClick">记住密码</van-checkbox></van-col>
    <van-col  span="8"><van-checkbox v-model="auto_login" @click="autoLoginClick">自动登录</van-checkbox></van-col>
  </van-row>

  <van-button size="large" type="info" class="login-btn" @click="login">登录</van-button>

  </div>
</template>

<script>
// @ is an alias to /src
import { Field, CellGroup, Button, Checkbox, CheckboxGroup, Icon, Row, Col } from 'vant'

export default {
  name: 'home',
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data () {
    return {
      user_name: '',
      user_pwd: '',
      remember_user: false,
      auto_login: false
    }
  },
  methods: {
    rememberUserClick () {
      this.auto_login = this.remember_user ? this.auto_login : false
    },
    autoLoginClick () {
      this.remember_user = this.auto_login ? true : this.remember_user
    },
    login () {
      if (!this.user_name || !this.user_pwd) {
        this.showToast({ msg: '请输入完整' })
        return
      }
      this.$api('/login', 'post', {
        username: this.user_name,
        password: this.user_pwd
      }).then(res => {
        console.log(res)
        if (res.data) {
          this.remember_user ? localStorage.setItem('loginInfo', JSON.stringify({ user_name: this.user_name, user_pwd: this.user_pwd })) : localStorage.removeItem('loginInfo')
          this.auto_login ? localStorage.setItem('loginFlag', '1') : localStorage.removeItem('loginFlag')
          this.$store.commit('setUserInfo', res.data)
          this.$router.push('/home')
        }
      })
    }
  },
  mounted () {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    const loginFlag = JSON.parse(localStorage.getItem('loginFlag'))
    this.user_name = loginInfo ? loginInfo.user_name : ''
    this.user_pwd = loginInfo ? loginInfo.user_pwd : ''
    this.remember_user = !!loginInfo
    this.auto_login = !!loginFlag
    loginFlag && this.login()
  }
}
</script>

<style lang="less" scoped>
  .login-wrap{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    text-align: center;
    .login-btn{
      margin: 15px 0;
      border-radius: 50px;
    }
  }
</style>
