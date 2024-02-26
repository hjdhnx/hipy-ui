<template>

  <div class="category-layout">
      <div class="category__line">
        <li class="category__first-ele">类型</li>
        <ul class="category__list category__sub">
          <li class="category__list__item category__sub__item" :class="currentClass===item? 'active':''"
              @click="handleClickClass(item)"
              v-for="item in categoryData.vodClassData">{{ item }}
          </li>
        </ul>
      </div>
      <div class="category__line">
        <li class="category__first-ele">地区</li>
        <ul class="category__list category__sub">
          <li class="category__list__item category__sub__item" :class="currentArea===item? 'active':''"
              @click="handleClickArea(item)"
              v-for="item in categoryData.vodAreaData">{{ item }}
          </li>
        </ul>
      </div>
      <div class="category__line">
        <li class="category__first-ele">年份</li>
        <ul class="category__list category__sub">
          <li class="category__list__item category__sub__item" :class="currentYear===item? 'active':''"
              @click="handleClickYear(item)"
              v-for="item in categoryData.vodYearData">{{ item }}
          </li>
        </ul>
      </div>
    </div>

</template>

<script>//没对接接口，后面根据接口来改写，通过循环生成筛选
const vodClassData = ['全部', '国产', '日剧', '韩剧', '欧美', '港澳', '泰剧', '台剧']
const vodAreaData = ['全部', '大陆', '香港', '台湾','加拿大','印度','土耳其','墨西哥','巴西','日本','韩国','西班牙','英国','美国','泰国','法国']
const vodYearData = ['全部']
for (let i = 2023; i > 2004; i--) {
  vodYearData.push(i)
}

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {},
  data(){
    return {
      currentClass:'全部',
      currentArea:'全部',
      currentYear:'全部',
      page:1,
      num_pages:0,

      categoryData:{
        vodClassData,
        vodAreaData,
        vodYearData
      },
      tData:{
        vodData: []
      }
    }
  },
  created() {
    this.page = 1
    this.getData()
  },
  methods:{
    handleClickClass(item){
      this.currentClass = item
      this.page = 1
      this.getData()
    },
    handleClickArea(item){
      this.currentArea = item
      this.page = 1
      this.getData()
    },
    handleClickYear(item){
      this.currentYear = item
      this.page = 1
      this.getData()
    },
    handleDetail(vod_id){
      this.$emit('filterSelected', vod_id);
    },
    getData() {
      const filterDict = {}
      filterDict['vod_type'] = 2
      if (this.currentClass !== '全部') {
        filterDict['vod_class'] = this.currentClass
      }
      if (this.currentArea !== '全部') {
        filterDict['vod_area'] = this.currentArea
      }
      if (this.currentYear !== '全部') {
        filterDict['vod_year'] = this.currentYear
      }
      filterDict['page'] = this.page
      // listApi(filterDict).then(res => {
      //   console.log(res.data)
      //   tData.vodData = res.data
      //   // 分页
      //   page.value = res.page
      //   num_pages.value = res.num_pages
      // }).catch(err => {
      //   console.log(err)
      // })
    },
    handlePre(){
      if (this.page > 1) {
        this.page -= 1
        this.getData()
      }
    },
    handleNext(){
      if (this.page < this.num_pages) {
        this.page += 1
        this.getData()
      }
    }
  },
}

</script>

<!-- 复制的样式没有做清理，上面布局好了再做清理 -->
<style rel="stylesheet/scss" lang="scss">

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

.category-layout {
  .category__line {
    display: flex;
    font-size: 14px;
    .category__first-ele {
      line-height: 32px;
      height: 32px;
      flex-shrink: 0;
      padding: 0 12px;
      border-radius: 2px;
      margin-right: 12px;
    }
    li {
      list-style: none;
    }

    .category__sub {
      line-height: normal;
      margin-bottom: 18px;
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
        background-color: rgba(0,0,0, 0.04);
        color: #fe3355;
        font-weight: 500;
      }
    }
  }
}
</style>
