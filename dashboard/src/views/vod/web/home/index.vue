<template>

	<div>

		<!-- <div class="header">
      <h3>最新电影</h3>
      <a class="more" href="/dianying">更多</a>
    </div>

    <div class="lvideo-list">
      <a class="video-item" :href="handleDetail(item.vod_id)" v-for="item in tData.dianying">
        <div class="cover-wrap">
          <img :src="item.vod_pic"/>
          <span class="remarks">{{ item.vod_remarks }}</span>
        </div>
        <div class="meta-wrap">
          <div class="title">{{ item.vod_name }}</div>
          <div class="info">{{ getFormatTime(item.vod_time, false) }}更新</div>
        </div>
      </a>
    </div> -->

		<div class="lvideo-list">
			<VideoItem :vodDatas="recommendations" />
		</div>

	</div>
</template>

<script>
import VideoItem from '@/views/vod/web/components/videoItem.vue'
	export default {
		name: 'VodWebIndex',
		components: {VideoItem},
		data() {
			return {
				recommendations: [{
					"vod_name": "测试",
					"vod_id": "index.html",
					"vod_pic": "https://gitee.com/CherishRx/imagewarehouse/raw/master/image/13096725fe56ce9cf643a0e4cd0c159c.gif",
					"vod_remarks": "原始hipy"
				}]
			};

		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				//this.recommendations = this.$store.vod.recommend ;
			}
		}
	}
</script>


<style rel="stylesheet/scss" lang="scss">

.lvideo-list {
    min-height: 200px;
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

   
  
}
</style>
