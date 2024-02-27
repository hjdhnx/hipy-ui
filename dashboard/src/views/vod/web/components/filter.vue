<template>
  <div class="category-layout">
    <div class="category__line" v-for="class_item in data">
      <li class="category__first-ele">{{ class_item.name }}</li>
      <ul class="category__list category__sub">
        <li class="category__list__item category__sub__item" :class="f[class_item.key] === item.v ? 'active' : ''"
          @click="handleClickClass(class_item.key, item.v)" v-for="item in class_item.value">{{ item.n }}
        </li>
      </ul>
    </div>
  </div>

  <!--      <div class="category__line">-->
  <!--        <li class="category__first-ele">类型</li>-->
  <!--        <ul class="category__list category__sub">-->
  <!--          <li class="category__list__item category__sub__item" :class="currentClass===item? 'active':''"-->
  <!--              @click="handleClickClass(item)"-->
  <!--              v-for="item in categoryData.vodClassData">{{ item }}-->
  <!--          </li>-->
  <!--        </ul>-->
  <!--      </div>-->
  <!--      <div class="category__line">-->
  <!--        <li class="category__first-ele">地区</li>-->
  <!--        <ul class="category__list category__sub">-->
  <!--          <li class="category__list__item category__sub__item" :class="currentArea===item? 'active':''"-->
  <!--              @click="handleClickArea(item)"-->
  <!--              v-for="item in categoryData.vodAreaData">{{ item }}-->
  <!--          </li>-->
  <!--        </ul>-->
  <!--      </div>-->
  <!--      <div class="category__line">-->
  <!--        <li class="category__first-ele">年份</li>-->
  <!--        <ul class="category__list category__sub">-->
  <!--          <li class="category__list__item category__sub__item" :class="currentYear===item? 'active':''"-->
  <!--              @click="handleClickYear(item)"-->
  <!--              v-for="item in categoryData.vodYearData">{{ item }}-->
  <!--          </li>-->
  <!--        </ul>-->
  <!--      </div> </div>-->
</template>

<script>

export default {
  components: {},
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      f: {}, // 筛选变量
    }
  },
  watch: {
    // 切换了分类数据重新把筛选全部清掉
    data(news) {
      this.f = {};
      //console.log("watch：", news);
    },
  },
  created() {
    this.f = {};
    //console.log("created：", this.data);
  },
  methods: {
    handleClickClass(key, value) {
      //console.log("key:",key);
      //console.log("value:",value);
      this.f[key] = value;
      //console.log("filterSelected:",this.f);
      this.$emit('filterSelected', this.f);
    },
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
        background-color: rgba(0, 0, 0, 0.04);
        color: #fe3355;
        font-weight: 500;
      }
    }
  }
}
</style>
