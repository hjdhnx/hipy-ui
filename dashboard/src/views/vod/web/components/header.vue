<template>
  <header class="header-layout">
    <div class="header-wrap">
      <a class="left-wrap" @click="handleOpenForm">
        <img :src="LogoImg" class="logo"/>
        <div class="title">{{ title }}</div>
      </a>
      <div class="right-wrap">
        <div class="search-wrap">
          <div class="input-container">
            <input class="input" type="search" placeholder="关键词" v-model="keywordRef" @keydown.enter="handleSearch">
            <span class="search-btn" role="button" tabindex="0" @click="handleSearch">
                <svg width="20" height="20" viewBox="0 0 24 24"
                     fill="none" xmlns="http://www.w3.org/2000/svg"
                     role="img">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.77 5.83a7.028 7.028 0 1 0-9.94 9.94 7.028 7.028 0 0 0 9.94-9.94Zm-11-1.06a8.528 8.528 0 0 1 12.568 11.507l3.892 3.893a.75.75 0 1 1-1.06 1.06l-3.893-3.892A8.53 8.53 0 0 1 4.769 4.77Z"
                        fill="#0C0D0F">
                  </path>
                </svg>
            </span>
          </div>
        </div>
        <div class="btn-wrap">
        </div>
      </div>
    </div>

    <!-- 换源对话框 -->
    <el-dialog :title="form_title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="button-container">
          <div class="btn-item" v-for="(site,index) in form.sites" :key="index">
            <el-button :type="form.new_site.key===site.key? 'success':'primary'" size="medium"
                       @click="handleChangeRule(site)">{{ site.name }}
            </el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirmChange">确认</el-button>
      </div>

    </el-dialog>

  </header>
</template>

<script>
import LogoImg from '@/assets/images/logo.png'
import cache from "@/plugins/cache"

export default {
  name: 'VodWebHeader',
  components: {},
  data() {
    return {
      // 弹出层标题
      form_title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {sites: [], now_site: {}, new_site: {}},
      LogoImg,
      keywordRef: '',
      title: 'hipy影视',
    }
  },
  created() {
    this.getCache()
  },
  methods: {
    handleSearch() {
      console.log(this.keywordRef)
      if (this.keywordRef !== '') {
        this.$router.push({path: '/vod/web/search', query: {keyword: this.keywordRef}})
      }
    },
    handleOpenForm() {
      this.open = true
      this.form_title = '请选择数据源'
      this.getData()
    },
    getCache() {
      let cacheSite = cache.local.getJSON('hipy_site');
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
      }
    },
    handleChangeRule(rule) {// 临时换源
      this.form.new_site = rule
    },
    handleConfirmChange() {//确认换源
      this.form.now_site = this.form.new_site
      this.open = false
      cache.local.setJSON('hipy_site', this.form.now_site)
      location.href = '/vod/web/'
    }
  },
}

</script>

<style rel="stylesheet/scss" lang="scss">
.button-container {
  width: 100%;
  overflow: hidden;
  padding: 2px 2px;
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

.header-layout {
  background-color: white;
  max-width: 1024px;
  width: 100%;
  height: 64px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  z-index: 99;

  .header-wrap {
    margin: 0 auto;
    height: 64px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    z-index: 1;

    .left-wrap {
      display: flex;
      flex-direction: row;
      //width: 140px;
      .logo {
        //background-image: url(https://lf3-static.bytednsdoc.com/obj/eden-cn/hbnpe_lm_wpn/ljhwZthlaukjlkulzlp/xigua_pc/new-pc-icons/logo.svg);
        background-position-y: center;
        background-repeat: no-repeat;
        display: block;
        width: 35px;
        height: 31px;
      }

      .title {
        display: inline-block;
        line-height: 31px;
        margin-left: 10px;
        font-size: 16px;
        font-weight: 700;
        text-shadow: 0 4px 8px rgba(216, 30, 6, 0.3); /*设置文字阴影*/
        user-select: none;
      }
    }

    .left-wrap:hover {
      color: #0c0d0f;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6); /*设置文字阴影*/
    }

    .right-wrap {
      flex: 1;
      padding: 0 1px;
      display: flex;

      .search-wrap {
        margin-left: 24px;
        position: relative;
        flex: 1 1;
        display: inline-block;
        height: 40px;
        max-width: 560px;
        min-width: 120px;
        z-index: 100;

        .input-container {
          position: relative;
          height: 40px;

          .input {
            transition: background-color .2s ease, outline .2s ease, box-shadow .2s ease;
            color: #0c0d0f;
            background-color: rgba(0, 0, 0, 0.04);
            padding: 0 32px 0 16px;
            line-height: 20px;
            width: 100%;
            caret-color: #0c0d0f;
            box-sizing: border-box;
            height: 100%;
            font-size: 14px;
            border: 1px solid transparent;
            border-radius: 4px;
          }
        }

        .search-btn {
          position: absolute;
          justify-content: center;
          margin: 4px 4px 4px 0;
          border-radius: 4px;
          height: 32px;
          width: 32px;
          display: flex;
          cursor: pointer;
          font-size: 14px;
          line-height: 18px;
          align-items: center;
          right: 0;
          top: 0;
          color: #0c0d0f;

          svg {
            height: 18px;
            width: 18px;
          }
        }

        .search-btn:after {
          content: "";
          position: absolute;
          left: -4px;
          display: block;
          width: 1px;
          pointer-events: none;
          height: 16px;
          background-color: rgba(12, 13, 15, .06);
        }
      }

      .btn-wrap {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: auto;
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
