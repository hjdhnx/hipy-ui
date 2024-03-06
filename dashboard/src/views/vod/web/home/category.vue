<template>
  <div class="layout-content">
    <div class="layout-content-main">
      <Filters v-if="filterData" :data="filterData" class="filter" @filterSelected="handleFilterSelection" />
      <videoList :videos="vodDatas" :class="['video-list', filterData ? 'scroll-y': '']" />

      <div v-if="num_pages > 1" class="page-wrap">
        <div class="page-item" :class="page === 1 ? 'disable' : ''" @click="handlePre()">上页</div>
        <div class="page-item" :class="page === num_pages ? 'disable' : ''" @click="handleNext()">下页</div>
      </div>
    </div>
  </div>
</template>

<script>
import Filters from '@/views/vod/web/components/filter.vue'
import videoList from '@/views/vod/web/components/videoList.vue'
import { CateGoryApi } from '@/api/vod/web'

export default {
  name: 'VodWebCategory',
  components: { Filters, videoList },
  data() {
    return {
      categoryId: '',
      filterData: null, // 分类数据
      page: 1,
      num_pages: 0,

      vodDatas: [],
      currentClass: {}// 选中的筛选集合
    }
  },
  watch: {
    '$route.query.t': function() {
      this.categoryId = this.$route.query.t
      console.log('this.categoryId:', this.categoryId)
      this.currentClass = {}
      this.getData()
    }
  },
  created() {
    this.categoryId = this.$route.query.t// 路由设置参数，从路径中获取参数
    console.log('this.categoryId:', this.categoryId)
    // this.filterData = this.$store.vod.filters;
    // this.categoryId = this.$route.params.vid;//路由设置参数，从路径中获取参数

    this.page = 1
    this.getData()
  },
  methods: {
    handleFilterSelection(item) {
      // console.log('handleFilterSelection:',item)
      this.currentClass = item
      this.page = 1
      this.getData()
    },
    getData() {
      this.filterData = this.categoryId ? this.$store.state.vod.filters[this.categoryId] : null
      console.log('hipy_sites from store:', this.$store.state.vod.hipy_sites)
      // console.log('this.filterData:',this.filterData)
      console.log('this.currentClass:', this.currentClass)
      CateGoryApi(this.categoryId, this.page, this.currentClass).then((resp) => {
        // console.log("resp:",resp)
        this.vodDatas = resp.list
        this.num_pages = resp.pagecount
      })
    },
    handlePre() {
      if (this.page > 1) {
        this.page -= 1
        this.getData()
      }
    },
    handleNext() {
      if (this.page < this.num_pages) {
        this.page += 1
        this.getData()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.layout-content {
  width: 100%;
  // display: flex;
  // flex-direction: column;
  overflow: hidden;
  .layout-content-main {
    height: 100%;
    overflow-y: auto;
  }
  .filter {
    position: relative;
    height: auto;
    margin-bottom: 10px;
    transition: height 0.3s;
  }
  .video-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    padding-bottom: 15px;
  };
  .scroll-y {
    padding-bottom: 0 !important;
    :global(.content-wrapper) {
      overflow-y: hidden !important;
    };
  }
  .page-wrap {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    .page-item {
      user-select: none;
      cursor: pointer;
      padding: 0 16px;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      background-color: #eee;
      color: #000;
      font-size: 12px;
      text-align: center;
    }
    .disable {
      color: grey;
    }
  }
}
</style>
