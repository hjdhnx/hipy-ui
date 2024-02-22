<template>
    
<div class="header">
    <h3>最新{{category }}</h3>
    <a class="more" :href="'/category/' + categoryId">更多</a>
  </div>

  <div class="lvideo-list">
    <videoItem :vodDatas="data"/>
  </div>

</template>


<script>
import videoItem from '@/views/vod/web/components/videoItem.vue'
export default {
  components: {videoItem},
  props: {
    category: {
      type: String,
      required: true
    },
    categoryId: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleDetail(vod_id){
      return '/detail/' + vod_id
    },getFormatTime(time,aaa){//处理时间格式

    }
  },
}

</script>

  
<style rel="stylesheet/scss" lang="scss">

@media screen and (min-width: 1px) and (max-width: 768px) {
  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
  }
}

a:hover {
  color: #0c0d0f;
}

.header {
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两端对齐 */
  h3 {
    line-height: 30px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0;
  }

  .more {
    cursor: pointer;
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
        right: 2px;
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

</style>
