<template>
  <div class="detail">
    <Header/>
    <div class="about">
      <img :src="LogoImg" style="width: 400px;height: 400px;"/>
      <div style="font-size: 18px;">扫个微信，聊一聊</div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import LogoImg from '@/assets/images/logo.png'

export default {
  name: 'VodWebAbout',
  components: {},
  data() {
    return {
      LogoImg,
    }
  },
  created() {
  },
  methods: {},
}
</script>

<style rel="stylesheet/scss" lang="scss">

.about {
  height: 800px;
  margin-top: 100px;
  text-align: center;
}
</style>
