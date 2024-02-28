<template>
  <div class="lvideo-list">
    <a class="video-item" @click="handleDetail(item.vod_id)" v-for="item in videoDatas">
      <div class="cover-wrap">
        <img :src="item.vod_pic" />
        <span v-if="item.vod_remarks" class="remarks">{{ item.vod_remarks }}</span>
        <div class="title">{{ item.vod_name }}</div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    videos: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      videoDatas: [],
    }
  },
  watch: {
    videos(news) {
      this.videoDatas = news;
    }
  },
  methods: {
    handleDetail(vod_id) {
      this.$router.push({
        path: '/vod/web/detail',
        query: {
          ids: vod_id
        }
      });
    },
  },
}
</script>


<style rel="stylesheet/scss" lang="scss">
@media screen and (min-width: 1px) and (max-width: 768px) {
  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
    height: auto !important;
  }

  .category__list {
    white-space: nowrap !important;
    overflow-x: auto !important;
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
    height: calc((1920px - 5 * 16px) / 6);
    aspect-ratio: 3/5;
    min-height: 120px;

    .cover-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      //display: inline-block;
      /* Display as inline block to auto adjust width */

      img {
        overflow: hidden;
        background-color: #e6f2f5;
        width: 100%;
        height: 100%;
        background-size: cover;
        object-fit: cover;
      }

      .remarks {
        position: relative;
        top: auto;
        right: 4px;
        bottom: 66px;
        color: #fff;
        font-size: 12px;
        padding: 10px;
        text-overflow: ellipsis;
        overflow: hidden;
        border-top-right-radius: 15px;
      }

      .remarks1111 {
        position: absolute;
        top: 75%;
        left: 0;
        bottom: 30px;
        color: white;
        text-align: left;
        font-size: 14px;
        white-space: nowrap;
        background-color: green;
        border-top-right-radius: 5px;
      }

      .title {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        /* Semi-transparent black background */
        color: white;
        padding: 5px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        /* Prevent line breaks */
      }

    }

  }
}
</style>
