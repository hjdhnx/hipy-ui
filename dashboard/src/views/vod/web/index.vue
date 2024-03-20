<template>
  <div class="preview-container">
    <Header />
    <div class="preview-content">
      <Menu :category="category" />
      <router-view class="content" />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/views/vod/web/components/header.vue'
import Footer from '@/views/vod/web/components/footer.vue'
import Menu from '@/views/vod/web/components/menu.vue'

import {
  HomeApi, ConfigApi, now_site
} from "@/api/vod/web";

import cache from "@/plugins/cache"

export default {
  name: 'VodWeb',
  components: {Header, Footer, Menu},
  data() {
    return {
      category: []
    }
  },
  created() {
    this.getConfig();
    // this.getData();
    console.log('filters:', this.getItem('filters'));
  },
  methods: {
    goHome() {
      if (this.$route.name === 'VodWeb') {
        console.log('自动跳转到分类页的首页')
        this.$router.push({
          path: '/vod/web/category',
          query: {}
        });
      }
    },
    getData() {
      HomeApi().then((resp) => {
        this.category = resp.class;
        //this.setItem('class', resp.class);
        this.setItem('filters', resp.filters||{});
        this.setItem('recommend', resp.list);
        this.goHome();
      })
    },
    getConfig() {
      ConfigApi().then((resp) => {
        let config = resp;
        console.log('config:', config)
        if (config.sites) {
          console.log('get config cost:', config.cost_time)
          let hipy_sites = config.sites.filter(it => it.key.startsWith('hipy_t4')||it.key.startsWith('drpy_t4'))
          console.log('hipy_sites from config:', hipy_sites)
          this.setItem('hipy_sites', hipy_sites);
          let cacheSite = cache.local.getJSON('hipy_site');
          if (!cacheSite && hipy_sites.length > 0) {//设置首页源
            cacheSite = hipy_sites[0]
            cache.local.setJSON('hipy_site', cacheSite);
            now_site.api_url = cacheSite.api
            now_site.extend = cacheSite.ext
            console.log('now_site:', now_site)
            console.log('cacheSite:', cacheSite)
          }
        }
        this.getData()
      })
    },
    setItem(key, value) {
      let new_value = {};
      new_value[key] = value;
      Object.assign(this.$store.state.vod, new_value);
    },
    getItem(key, value) {
      return this.$store.state.vod[key] || value;
    }
  },
}

</script>

<style lang="scss" scoped>
.preview-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .preview-content {
    width: 100%;
    height: calc(100% - 72px - 100px);
    .content {
      min-height: calc(100% - 53px);
      max-height: calc(100% - 42px);
      height: 100%;
    }
  }
}

@media screen and (min-width: 1px) and (max-width: 932px) {
  .content {
    height: calc(100% - 42px) !important;
  }
}
</style>
