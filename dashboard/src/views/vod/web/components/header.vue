<template>
  <header class="header-container">
    <div class="header-wrap">
      <a class="left-wrap" @click="handleOpenForm">
        <img :src="LogoImg" class="logo">
        <div class="title">{{ title }}</div>
      </a>
      <div class="right-wrap">
        <div class="search-wrap">
          <div class="input-container">
            <input v-model="keywordRef" class="input" type="search" placeholder="请输入关键词" @keydown.enter="handleSearch">
            <span class="search-btn" @click="handleSearch">
              <em>全网搜</em>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 换源对话框 -->
    <el-dialog :title="form_title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="button-container">
          <div v-for="(site,index) in form.sites" :key="index" class="btn-item">
            <el-button
              :type="form.new_site.key===site.key? 'success':'primary'"
              size="medium"
              @click="handleChangeRule(site)"
            >{{ site.name }}
            </el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="handleConfirmClear">清除缓存</el-button>
        <el-button type="primary" @click="handleConfirmChange">确认换源</el-button>
      </div>

    </el-dialog>

  </header>
</template>

<script>
import LogoImg from '@/assets/images/logo.png'
import cache from '@/plugins/cache'

export default {
  name: 'VodWebHeader',
  components: {},
  data() {
    return {
      // 弹出层标题
      form_title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: { sites: [], now_site: {}, new_site: {}},
      LogoImg,
      keywordRef: '',
      title: 'hipy影视'
    }
  },
  created() {
    this.getCache()
  },
  methods: {
    handleSearch() {
      console.log(this.keywordRef)
      if (this.keywordRef !== '') {
        this.$router.push({ path: '/vod/web/search', query: { keyword: this.keywordRef }})
      }
    },
    handleOpenForm() {
      this.open = true
      this.form_title = '请选择数据源'
      this.getData()
    },
    getCache() {
      const cacheSite = cache.local.getJSON('hipy_site')
      if (cacheSite) {
        this.form.now_site = cacheSite
        this.title = cacheSite.name
      }
    },
    getData() {
      console.log('header组件-hipy_sites from store:', this.$store.state.vod.hipy_sites)
      this.form.sites = this.$store.state.vod.hipy_sites
      this.form.new_site = this.form.now_site
      if (!this.form.new_site.key && this.form.sites.length > 0) {
        this.form.new_site = this.form.sites[0]
      } else if (this.form.new_site.key && !this.form.sites.map(i => i.key).includes(this.form.new_site.key)) {
        this.form.new_site = this.form.sites[0]
      }
    },
    handleChangeRule(rule) { // 临时换源
      this.form.new_site = rule
    },
    handleConfirmChange() { // 确认换源
      this.form.now_site = this.form.new_site
      this.open = false
      cache.local.setJSON('hipy_site', this.form.now_site)
      location.href = '/vod/web/'
    },
    handleConfirmClear() { // 清除缓存
      this.$confirm('确认清除缓存？这将会重置已选首页源为配置里的第一个源')
        .then(_ => {
          cache.local.remove('hipy_site')
          this.open = false
          // 清除缓存自动处理换源的缓存接口问题
          location.href = '/vod/web/'
        })
        .catch(_ => {
        })
    }
  }
}

</script>

<style lang="scss" scoped>
.button-container {
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;

  .btn-item {
    text-align: center;
    //width:calc(20% - 30px);
    width: calc(33.3%);
    padding: 2px 2px 2px 2px;
    //margin-bottom:5px;
    //margin-left: 10px;
    //margin-right: 10px;
    &:nth-child(8) {
      margin-right: 0;
    }

    button {
      width: 95%;
    }
  }
}

.header-container {
  position: relative;
  height: 72px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 80px rgba(0,0,0,.2);
  z-index: 99;
  .header-wrap {
    position: absolute;
    width: 100%;
    padding: 0 15px;
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .left-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      .logo {
        width: 30px;
        height: 30px;
      }
      .title {
        margin-left: 10px;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .right-wrap {
      .search-wrap {
        .input-container {
          position: relative;
          height: 40px;
          padding: 0;
          border-bottom: 0;
          border-radius: 20px;
          .input {
            border: 0;
            color: rgba(0, 0, 0, .8);
            background: rgba(0, 0, 0, .05);
            border-radius: 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            height: 40px;
            padding: 0 120px 0 15px;
            font-size: 15px;
            line-height: 40px;
            text-align: left;
          }
          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 82px;
            height: 40px;
            border-radius: 20px;
            cursor: pointer;
            background-image: linear-gradient(90deg, #8cf19d, #a0dfff 46%, #659dff);
            em {
              display: block;
              color: #fff;
              font-size: 15px;
              line-height: 40px;
              text-align: center;
            }
          }
        }
      }

      .nav-list {
        font-size: 14px;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        color: #0c0d0f;
        margin-left: 24px;

        .siteHeader__textBtn {
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
          border-radius: 4px;

          div {
            display: flex;
            align-items: center;
            line-height: 18px;
            padding: 6px 8px;
          }
        }

        li {
          cursor: pointer;
          margin-left: 12px;
          list-style: none;
        }
      }
    }
  }
}
</style>
