<template>
  <div>
    <my-header :title="'编辑个人信息'" :leftArrow="true" @goBack="handleGoBack"/>
    <div class="user-container">
      <van-cell-group>
        <van-field label="用户名:" maxlength="11" required clearable v-model="userInfo.userName" />
        <van-field label="手机号:" maxlength="11" required clearable v-model="userInfo.phoneNum" />
        <van-field label="密码:" maxlength="13" type="password" required v-model="userInfo.password"/>
      </van-cell-group>
      <div class="btn">
        <van-button type="info" @click="submit" class="">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from '../../components/common/my-header'
import { Field, CellGroup, Button } from 'vant'
export default {
  components: {
    MyHeader,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
  data () {
    return {
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
    submit () {
      if (!this.userInfo.userName || !this.userInfo.phoneNum || !this.userInfo.password) {
        this.showToast({ msg: '请输入完整' })
        return
      }
      this.$api('/updateUser', 'post', this.userInfo).then(res => {
        this.showToast({ msg: '修改成功' })
        this.$store.commit('setUserInfo', res.data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .user-container{
    margin-top: 50px;
    width: 100%;
    .btn{
      width: 120px;
      height: 60px;
      margin: 150px auto;
    }
  }
</style>
