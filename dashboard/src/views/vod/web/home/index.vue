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

    <Recommendation v-for="(categoryData, index) in recommendations" :key="index" :category="categoryData.category" :categoryId="categoryData.categoryId" :data="categoryData.data" />

  </div>
</template>

<script>
import Recommendation from '@/views/vod/web/components/Recommendation.vue'

export default {
  name: 'VodWebIndex',
  components: {Recommendation},
  data() {
    
    return {
      recommendations: [//-----[data中的数据就是推荐视频列表数据]对接好接口，清空此数组-----
        { category: "电影", categoryId: "1",data: [
          { title: "电影1" },
          { title: "电影2" },
          { title: "电影3" }
        ]},
        { category: "电视剧",categoryId: "2", data: [
          { title: "电视剧1" },
          { title: "电视剧2" },
          { title: "电视剧3" }
        ]}
        // 可以添加更多不同分类的数据
      ]
    };

  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      //--【这里调用接口获取推荐列表数据，推荐列表中包含类型名称，类型id，类型下数据集合】 --
      // homeApi({}).then(res => {
      //   console.log(res.data)
      //   this.recommendations = res.data;
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  }
}

</script>
