<template>
  <div class="no-data">
    <img src="../../assets/images/no_data.png" alt="">
    <div class="desc">{{desc}}</div>
  </div>
</template>

<script>
export default {
  props: {
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  .no-data
    width 200px
    height 200px
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    text-align center
    font-size 16px
    img
      width 180px
      height 150px
    .desc
      margin-top 10px
</style>
