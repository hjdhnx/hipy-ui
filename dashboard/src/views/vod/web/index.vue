<template>
  <div>
    <div class="portal">
      <Header />
      <Menu :category="category" />
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/views/vod/web/components/header.vue'
import Footer from '@/views/vod/web/components/footer.vue'
import Menu from '@/views/vod/web/components/menu.vue'

import {
  HomeApi
} from "@/api/vod/web";

export default {
  name: 'VodWeb',
  components: { Header, Footer, Menu },
  data() {
    return {
      category: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      HomeApi().then((resp) => {
        this.category = resp.class;
        // console.log(this.$store.vod);
        // this.$store.vod.filters = resp.filters;
        // this.$store.vod.recommend = resp.list;
      })
    }

  },
}


</script>


<style rel="stylesheet/scss" lang="scss">
.portal {
  width: 100%;
  max-width: 1024px;
  min-height: calc(100vh - 180px);
  margin: 0 auto;
  padding: 0 10px 16px;
}

body {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Helvetica Neue, PingFang SC, Helvetica, Microsoft Yahei, Arial, sans-serif;
}
</style>
