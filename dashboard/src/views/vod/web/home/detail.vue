<template>
  <div class="detail">

    <Header/>

    <div class="player-wrap">
      <div class="left">
        <video id="player-box"></video>

      </div>
      <div class="right" v-for="tab_item in tData.playData">
        <h3>线路</h3>
        <div class="p-list">
          <div class="p-item" :class="currentLink===item.link? 'active':''" v-for="item in tab_item"
               @click="startPlay(item.link)">{{ item.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrap">
      <div class="meta-wrap">
        <h1 class="title">{{ tData.detailData.vod_name }}</h1>
        <div class="category">{{ tData.detailData.vod_class }} / {{ tData.detailData.vod_area }} /
          {{ tData.detailData.vod_year }}
        </div>
        <div class="info-wrap">
          <img :src="tData.detailData.vod_pic"/>
          <div class="info">
            <div class="info-item">导演: {{ tData.detailData.vod_director }}</div>
            <div class="info-item">演员: {{ tData.detailData.vod_actor }}</div>
            <div class="info-item">
              <div v-html="tData.detailData.brief"></div>
            </div>
          </div>
        </div>
      </div>
      <h3 style="height:40px;border-bottom: 1px solid rgba(0, 0, 0, 0.04);">内容详情</h3>
      <div v-html="tData.detailData.vod_content"></div>

      <h3 style="height:40px;border-bottom: 1px solid rgba(0, 0, 0, 0.04);">为你推荐</h3>
      <div class="lvideo-list">
        <a class="video-item" :href="handleDetail(item.vod_id)" v-for="item in tData.recommendData">
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
    </div>
  </div>
</template>
<script>
import Header from '@/views/vod/web/components/header.vue'
import {DetailApi} from "@/api/vod/web";

export default {
  name: 'VodWebDetail',
  components: {Header},
  data() {
    return {
      currentLink: '',
      tData: {
        detailData: {},
        playData: [],
        recommendData: []
      },
      vod_id: ''
    }
  },
  created() {
    this.vod_id = this.$route.query.ids;//路由设置参数，从路径中获取参数
    this.getData()
  },
  watch: {
    '$route.query.ids': function () {
      this.vod_id = this.$route.query.ids
      this.getData();
    },
  },

  methods: {
    handleDetail(vod_id) {
      return '/detail/' + vod_id
    },
    startPlay(url) {
      console.log(url)
    },
    setSEO() {
      let title = this.tData.detailData.vod_name
      let director = this.tData.detailData.vod_director
      let actor = this.tData.detailData.vod_actor
      if (title) {
        let seoTitle = title + "-免费观看-在线电影免费"
        let seoKeywords = title + ",在线观看," + director
        let seoDescription = title + ",在线观看," + actor
        document.title = seoTitle
        let $keywords = document.querySelector('meta[name="keywords"]')
        let $description = document.querySelector('meta[name="description"]')
        if ($keywords) {
          $keywords.setAttribute('content', seoKeywords)
        }
        if ($description) {
          $description.setAttribute('content', seoDescription)
        }
      }
    },
    getData() {
      DetailApi(this.vod_id).then(res => {
        if (res.list && res.list.length > 0) {
          this.tData.detailData = res.list[0]
          this.tData.detailData.brief = "简介：" + this.tData.detailData.vod_content.substring(0, 100) + '...'
          this.tData.detailData.description = this.tData.detailData.vod_content
          // 设置seo词汇
          this.setSEO()
          // 剥离播放地址
          let playData = []
          let vodPlayUrl = this.tData.detailData.vod_play_url
          let vodTabList = vodPlayUrl.split("$$$")
          vodTabList.forEach(tab_item => {
            let vodPlayList = tab_item.split("#")
            let tabPlayData = []
            vodPlayList.forEach(item => {
              let playItem = item.split("$")
              let label = playItem[0]
              let link = playItem[1]
              tabPlayData.push({
                label: label,
                link: link
              })
            })
            playData.push(tabPlayData)
          })
          this.tData.playData = playData
          // 默认播首个
          this.currentLink = this.tData.playData[0].link
          // startPlay(currentLink.value)
          // 获取推荐
          // getRecommendData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getRecommendData() {
      // recommendApi({
      //   vod_class: tData.detailData.vod_class
      // }).then(res => {
      //   tData.recommendData = res.data
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss">

@media screen and (min-width: 1px) and (max-width: 768px) {
  // 播放器相关
  #player-box {
    height: 220px !important;
  }

  .video-item {
    width: calc((100% - 2 * 16px) / 3) !important;
  }

}

@media screen and (min-width: 768px) {
  // 播放器相关
  #player-box {
    height: 480px !important;
  }

  // 分集
  .p-item {
    width: calc((100% - 3 * 10px) / 4) !important;
  }
}


dl, ol, ul {
  margin-bottom: 0px;
  margin-top: 0;
}


.detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.player-wrap {
  margin-top: 70px;
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .left {

    #player-box {

      width: 100%;
      background-color: #000;
    }
  }

  .right {

    width: 100%;
    height: auto;
    padding: 16px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.04);

    .p-list {
      max-height: calc(100% - 25px - 32px);
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      overflow-y: auto;

      .p-item {
        cursor: pointer;
        align-items: center;
        justify-content: center;
        width: calc((100% - 2 * 10px) / 3);
        padding: 8px 0;
        border-radius: 2px;
        color: #0c0d0f;
        background-color: rgba(0, 0, 0, 0.04);
        font-weight: inherit;
        font-family: inherit;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .active {
        color: #fe3355;
      }
    }
  }
}

.content-wrap {
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
  max-width: 1024px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .meta-wrap {
    //padding-left: 12px;
    //padding-right: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.04);
    }

    .category {
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      color: #606266;
      font-size: 14px;
    }

    .info-wrap {
      margin-top: 16px;
      display: flex;
      flex-direction: row;
      gap: 16px;

      img {
        width: 100px;
        height: 120px;
        background-size: cover;
        object-fit: cover;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: #606266;
        font-size: 14px;

        .line {

          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }

  .lvideo-list {
    min-height: 200px;
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

}


</style>
