<template>
<div>
  <a class="video-item" :href="handleDetail(item.vod_id)" v-for="item in vodDatas">
    <div class="cover-wrap">
      <img :src="item.vod_pic"/>
      <span class="remarks">{{ item.vod_remarks }}</span>
    </div>
    <div class="meta-wrap">
      <div class="title">{{ item.vod_name }}</div>
      <div class="info">{{ getFormatTime(item.vod_time, false) }}更新</div>
    </div>
  </a>
</div>
</template>

<script>
export default {
  props: {
    vodDatas: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleDetail(vod_id){
      return '/detail/' + vod_id
    },
  },
}
</script>


<style rel="stylesheet/scss" lang="scss">

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
        //background: url(../load.gif) no-repeat;
        // background-color: #e6f2f5;
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

  </style>
