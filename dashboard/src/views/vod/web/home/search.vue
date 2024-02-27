<template>
  <div class="layout-content">

    <h3>与"{{ keyword }}"相关视频：</h3>

    <videoList :videos="vodDatas" />

    <div class="page-wrap" v-if="num_pages > 1">
      <div class="page-item" :class="page === 1 ? 'disable' : ''" @click="handlePre()">上页</div>
      <div class="page-item" :class="page === num_pages ? 'disable' : ''" @click="handleNext()">下页</div>
    </div>
  </div>
</template>
<script>
import {
  SearchApi
} from "@/api/vod/web";

import videoList from '@/views/vod/web/components/videoList.vue'
export default {
  name: 'VodWebSearch',
  components: { videoList },
  data() {
    return {
      page: 1,
      num_pages: 0,
      vodDatas: [],
      keyword: '',
    }
  },
  created() {
    this.keyword = this.$route.query.keyword;
    this.page = Number(this.$route.query.pg || 1);
    this.getData()
  },
  watch: {
    '$route.query.keyword': function () {
      this.keyword = this.$route.query.keyword
    },
    '$route.query.pg': function () {
      this.page = Number(this.$route.query.pg || 1);
    },
    // $route() {
    //   this.keyword = this.$route.query.keyword
    //   this.page = Number(this.$route.query.pg || 1);
    // },
  },
  methods: {
    handleDetail(vod_id) {
      return '/detail/' + vod_id
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
    },
    getData() {
      // const filterDict = {}
      // filterDict['keyword'] = this.keyword
      // filterDict['page'] = this.page
      SearchApi(this.keyword, this.page).then((resp) => {
        this.vodDatas = resp.list
        this.num_pages = 10
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.layout-content {
  width: 100%;
  padding: 1px 0px;

  .category-layout {
    .category__line {
      display: flex;
      font-size: 14px;

      .category__first-ele {
        line-height: 32px;
        height: 32px;
        flex-shrink: 0;
        padding-right: 12px;
        border-radius: 2px;
        margin-right: 12px;
      }

      li {
        list-style: none;
      }

      .category__sub {
        line-height: normal;
        margin-bottom: 12px;
      }

      .category__list {
        font-size: 0;
        position: relative;


        .category__list__item {
          display: inline-block;
          margin-right: 40px;
          cursor: pointer;
          font-size: 16px;
          line-height: 22px;
          color: #606266;
        }

        .category__sub__item {
          font-size: 14px;
          line-height: 32px;
          margin-bottom: 2px;
          color: #0c0d0f;
          padding: 0 12px;
          border-radius: 2px;
          margin-right: 12px;
        }

        .active {
          background-color: rgba(0, 0, 0, 0.04);
          color: #fe3355;
          font-weight: 500;
        }
      }

      .category__list::-webkit-scrollbar {
        display: none;
      }
    }
  }


  .page-wrap {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */

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
