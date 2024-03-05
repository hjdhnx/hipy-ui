<template>
  <div class="content-container">
    <div class="content-wrapper">
      <div class="container-flow-wrap">
        <a v-for="item in videoDatas" :key="item.vod_id" class="video-item" @click="handleDetail(item.vod_id)">
          <div class="cover-wrap">
            <img :src="item.vod_pic">
            <span v-if="item.vod_remarks" class="remarks">{{ item.vod_remarks }}</span>
            <div class="title">{{ item.vod_name }}</div>
          </div>
        </a>
      </div>
    </div>
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
      videoDatas: []
    }
  },
  watch: {
    videos(news) {
      this.videoDatas = news
    }
  },
  methods: {
    handleDetail(vod_id) {
      this.$router.push({
        path: '/vod/web/detail',
        query: {
          ids: vod_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1px) and (max-width: 932px) {
  .container-flow-wrap {
    gap: 14px !important;
  }
  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
    height: auto !important;
  }

  .category__list {
    white-space: nowrap !important;
    overflow-x: auto !important;
  }
}

.content-container {
  width: 100%;
  height: 100%;
  .content-wrapper {
    padding: 0 15px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-grow: 1;
    .container-flow-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 28px;
      .video-item {
        // width: calc((100% - 3 * 16px) / 3);
        height: calc((1920px - 5 * 16px) / 6);
        aspect-ratio: 3/5;
        min-height: 120px;
        background-color: #000;
        border-radius: 5px;
        overflow: hidden;
        .cover-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            background-size: cover;
            object-fit: cover;
          }

          .remarks {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 0 5px 0 5px;
            color: #fff;
            font-size: 12px;
            padding: 1px 6px;
            height: 18px;
            line-height: 18px;
            text-overflow: ellipsis;
            overflow: hidden;
            background: #22c045;
          }

          .title {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .1) 30%, rgba(0, 0, 0, .5));
            background-color: #141619;
            padding: 0 8px;
            color: #fff;
            font-weight: 500;
            padding: 5px;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
