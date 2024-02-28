<template>
  <div class="detail">
    <div class="player-wrap">
      <div class="left">
        <video id="player-box" v-if="!playUrl"></video>
        <video-player
          ref="videoPlayer"
          class="video-player vjs-custom-skin"
          :playsinline="false"
          :options="playOptions"
          @ready="onPlayerReady"
          @play="onPlayerPlay($event)"
          @pause="onPlayerPause($event)"
          @ended="onPlayerEnd($event)"
          @waiting="onPlayerWaiting($event)"
          @playing="onPlayerPlaying($event)"
          @loadeddata="onPlayerLoadeddata($event)"
          @timeupdate="onPlayerTimeupdate($event)"
          @statechanged="playerStateChanged($event)"
          v-if="playUrl"
        />
      </div>
      <div class="right" v-for="(tab_item, tab_index) in tData.playData" :key="tab_index">
        <h3 @click="handleCopyUrl">{{ tData.tabList[tab_index] }}|<span class="tab_count">{{ tData.tabCount }}</span>
        </h3>
        <div class="p-list">
          <div class="p-item" :class="currentLink===item.link? 'active':''" v-for="item in tab_item"
               @click="startPlay(item.link,tData.tabList[tab_index])">{{ item.label }}
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
import LogoImg from '@/assets/images/logo.png'
import {DetailApi, PlayApi} from "@/api/vod/web";
import {delRecord} from "@/api/hiker/developer";

export default {
  name: 'VodWebDetail',
  components: {Header},
  data() {
    return {
      currentLink: '',
      currentTab: '',
      playedTime: 0,
      playUrl: '', // 播放直链
      tData: {
        detailData: {},
        playData: [],
        tabList: [],
        tabCount: 0,
        recommendData: []
      },
      vod_id: '',

      playOptions: {
        height: "200px",
        width: "100%",
        playbackRates: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0], // 可选的播放速度
        autoplay: true, // 如果为true,浏览器准备好时开始回放
        muted: false, // 默认情况下静音播放
        loop: false, // 是否视频一结束就重新开始循环播放
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据，auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值，值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小，换句话说，它将按比例缩放以适应其容器
        sources: [
          // {
          //   // type: "video/mp4", // 类型
          //   // type: "video/MP2T", // 类型
          //   // type: "application/x-mpegURL", // 类型
          //   // src: require("./1.mp4"), // url地址，在使用本地的资源时，需要用require()引入，否则控制台会报错
          //   // src: 'https://newcntv.qcloudcdn.com/asp/hls/2000/0303000a/3/default/ec43c5b995f24fe9a6101367a7148347/2000.m3u8', // url地址，在使用本地的资源时，需要用require()引入，否则控制台会报错
          //   src: 'https://newcntv.qcloudcdn.com/asp/hls/2000/0303000a/3/default/ec43c5b995f24fe9a6101367a7148347/2000.m3u8', // url地址，在使用本地的资源时，需要用require()引入，否则控制台会报错
          // },
          {
            // src:"https://newcntv.qcloudcdn.com/asp/hls/2000/0303000a/3/default/ec43c5b995f24fe9a6101367a7148347/2000.m3u8"
            src: ""
          }
        ],
        // 设置封面地址
        poster: {
          type: String,
          // LogoImg
          default: ''
        },
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息
        controlBar: {
          currentTimeDisplay: true, // 当前时间
          progressControl: true,  // 是否显示进度条
          playbackRateMenuButton: true, // 是否显示调整播放倍速按钮
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
          volumeControl: false, // 声音控制键
          playToggle: true, // 暂停和播放键
        },
      },

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
    handleCopyUrl() {
      let self = this;
      this.$confirm('是否复制当前播放视频地址:\n' + this.playUrl, '询问', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return self.$copyText(self.playUrl)
      }).then((e) => {
        this.$message({
          message: '已复制到剪切板\n' + e.text,
          type: 'success'
        });
      }).catch((e) => {
        // this.$message.error('链接地址复制失败:'+e.message);
      });
    },
    startPlay(url, flag) {
      console.log('url:', url, ' flag:', flag)
      if (this.currentLink !== url) { // 切换视频清空播放进度
        this.playedTime = 0
      }
      this.currentLink = url
      this.currentTab = flag
      PlayApi(url, flag).then(resp => {
        console.log(resp)
        let $player = document.querySelector('video[id="player-box"]')
        if ($player) {
          $player.setAttribute('src', resp.url)
          $player.setAttribute('autoplay', true)
        }
        let playUrl = resp.url
        this.playOptions.sources[0].src = playUrl
        if (playUrl.endsWith('.mp4')) {
          this.playOptions.sources[0].type = "video/mp4"
        } else {
          this.playOptions.sources[0].type = undefined
        }

        this.playUrl = playUrl
        // console.log(this.$refs.videoPlayer.player)
        // this.load()
      })
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

          // 设置视频封面地址
          this.playOptions.poster = this.tData.detailData.vod_pic
          // 设置简介
          this.tData.detailData.brief = "简介：" + this.tData.detailData.vod_content.substring(0, 100) + '...'
          this.tData.detailData.description = this.tData.detailData.vod_content
          // 设置seo词汇
          this.setSEO()
          // 剥离播放地址
          let playData = []
          let tabList = this.tData.detailData.vod_play_from.split('$$$')
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
          this.tData.tabList = tabList
          this.tData.tabCount = tabList.length
          this.startPlay(playData[0][0].link, tabList[0])
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
    },

    // 准备好了
    onPlayerReady() {
      console.log("准备好了");
    },
    // 视频播放
    onPlayerPlay(player) {
      console.log('播放了');
      // console.log(player);
      let playTime = 0;
      if (
        Number(Math.floor(this.playedTime)) ===
        Number(Math.floor(player.duration()))
      ) {
        this.playedTime = 0;
        playTime = 0;
      } else if (
        Number(Math.floor(player.currentTime())) !==
        Number(Math.floor(this.playedTime))
      ) {
        playTime = this.playedTime;
        player.currentTime(playTime)
      }
    },
    // 视频暂停的
    onPlayerPause(player) {
      console.log('暂停中');
      // console.log(player);
      this.playedTime = player.currentTime();
    },
    // 视频播放完
    onPlayerEnd(player) {
      console.log('播放结束了');
      // console.log(player);
    },
    // DOM元素上的readyState更改导致播放停止
    onPlayerWaiting(player) {
      console.log("播放停止中");
      // console.log(player);
    },
    // 视频已开始播放
    onPlayerPlaying(player) {
      console.log("开始播放了");
      // console.log(player);
    },
    // 当播放器在当前播放位置下载数据时触发
    onPlayerLoadeddata(player) {
      console.log("开始下载数据");
      // console.log(player);
    },
    // 当前播放位置发生变化时触发
    onPlayerTimeupdate(player) {
      // console.log("播放位置变化了");
      // console.log(player);
      let timeDisplay = player.currentTime();
      if (timeDisplay - this.currentTime > 1) {
        player.currentTime(this.currentTime > this.maxTime ? this.currentTime : this.maxTime);
      }
      this.currentTime = player.currentTime();
      this.maxTime = this.currentTime > this.maxTime ? this.currentTime : this.maxTime;
    },
    //播放状态改变
    playerStateChanged(playerCurrentState) {
      // console.log("播放状态变化了");
      // console.log(playerCurrentState);
    },
    // 手动暂停视频的播放
    pause() {
      // 视频播放器的方法调用，要使用this.$refs.videoPlayer.player这个对象去调用
      this.$refs.videoPlayer.player.pause()
    },
    // 手动播放视频
    play() {
      // 视频播放器的方法调用，要使用this.$refs.videoPlayer.player这个对象去调用
      this.$refs.videoPlayer.player.play()
    },
    load() {
      this.$refs.videoPlayer.player.load()
    }

  },
}
</script>
<style rel="stylesheet/scss" lang="scss">
/* 播放按钮换成圆形 */
.vjs-custom-skin > .video-js .vjs-big-play-button {
  height: 2em;
  width: 2em;
  line-height: 2em;
  border-radius: 1em;
}

.tab_count {
  color: gray;
  font-size: medium;
}

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
