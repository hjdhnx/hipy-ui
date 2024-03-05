<template>
  <div class="footer-view">
    <div class="foot-link-box flex-view">
      <a href="/" class="foot-link" target="_blank">在线留言</a>
      <div class="link-split" />
      <a href="/" class="foot-link" target="_blank">排行榜</a>
      <div class="link-split" />
      <a href="/" class="foot-link" target="_blank">网站地图</a>
    </div>
    <div class="footer-infos">
      <span>
        <a style="color: #828a92;padding: 0 20px;">本网站只提供web页面服务, 通过链接的方式提供相关内容(所有视频内容收集于各大视频网站), 本站不对链接内容具有进行编辑、整理、修改等权利。如有问题, 请反馈E-mail: kefu009#gmail.com</a>
      </span>
    </div>
    <div class="address">2022-2023 © 火星代码工作室 · All Rights Reserved</div>
  </div>
</template>

<script>
export default {
  name: 'VodWebFooter',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.footer-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 99;
  background-color: #2a2a32;
  width: 100%;
  height: 100px;
  padding: 10px 0;
}

.footer-view {
  position: absolute;
  bottom: 0;
  left: 0;
  .foot-link-box {
    display: flex;
    align-items: center;
    overflow: hidden;
    justify-content: center;

    .foot-link {
      font-size: 12px;
      margin: 0 16px;
      color: #fff;
    }

    .link-split {
      display: inline-block;
      width: 1px;
      height: 13.5px;
      background-color: #828a92;
    }

    a {
      background-color: transparent;
      text-decoration: none;
      color: #fff;
    }
  }

  .footer-infos {
    font-size: 12px;
    color: #828a92;
    margin-top: 16px;
    text-align: center;
  }

  .address {
    text-align: center;
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    color: #828a92;
    margin-top: 8px;
  }
}
</style>
