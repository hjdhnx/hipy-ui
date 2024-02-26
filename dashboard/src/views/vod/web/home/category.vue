<template>
  <div class="layout-content">

    <Filters :data="filterData" @filterSelected="handleFilterSelection" />

    <div class="lvideo-list">
      <VideoItem :vodDatas="vodDatas" />
    </div>

    <div class="page-wrap" v-if="num_pages > 1">
      <div class="page-item" :class="page === 1 ? 'disable' : ''" @click="handlePre()">上页</div>
      <div class="page-item" :class="page === num_pages ? 'disable' : ''" @click="handleNext()">下页</div>
    </div>

  </div>
</template>

<script>
import Filters from '@/views/vod/web/components/filter.vue'
import VideoItem from '@/views/vod/web/components/videoItem.vue'
import {CateGoryApi} from "@/api/vod/web";

export default {
  name: 'VodCategory',
  components: { Filters, VideoItem },
  data() {
    return {
      categoryId: '',
      filterData: [],//分类数据
      page: 1,
      num_pages: 0,

      vodDatas: [],
      currentClass:[]//选中的筛选集合
    }
  },
  created() { 
    this.categoryId = this.$route.query.t;//路由设置参数，从路径中获取参数
    console.log('this.categoryId:',this.categoryId)
    //this.filterData = this.$store.vod.filters;
    //this.categoryId = this.$route.params.vid;//路由设置参数，从路径中获取参数

    this.page = 1
    //this.getData()
  }, 
  watch: {
    '$route.query.t': function () {
      this.categoryId = this.$route.query.t
      console.log('this.categoryId:',this.categoryId)
      this.getData();
    },
  },
  methods: {
    handleFilterSelection(item) {
      this.currentClass = item
      this.page = 1
      this.getData()
    },
    getData() {
      this.filterData = this.categoryId?this.$store.state.vod.filters[this.categoryId]:null
      console.log(this.filterData)
      CateGoryApi(this.categoryId,this.page,this.currentClass).then((resp) => {
        console.log(resp)
        //this.vodDatas = resp.list;
        //this.num_pages=resp.count;
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
  },
}

</script>

<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1px) and (max-width: 768px) {
  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
  }

  .category__list {
    white-space: nowrap !important;
    overflow-x: auto !important;
  }
}


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
          padding: 0 8px;
          border-radius: 2px;
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

  .lvideo-list {
    min-height: 200px;
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .video-item {
      width: calc((100% - 3 * 16px) / 4);
      aspect-ratio: 3/5;
      min-height: 120px;

      .cover-wrap {
        position: relative;
        width: 100%;
        height: 85%;

        img {
          border-radius: 4px;
          overflow: hidden;
          // todo 修改默认图
          background-color: #e6f2f5;
          width: 100%;
          height: 100%;
          background-size: cover;
          object-fit: cover;
        }

        .remarks {
          position: absolute;
          right: 4px;
          bottom: 1px;
          color: #fff;
          font-size: 12px;
        }
      }

      .meta-wrap {
        .title {
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .info {
          display: none;
        }

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
