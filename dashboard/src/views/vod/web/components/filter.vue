<template>
  <div class="category-layout">
    <div class="category__line" v-for="class_item in data" :key="class_item.name">
      <li class="category__first-ele">{{ class_item.name }}</li>
      <ul class="category__list category__sub">
        <li class="category__list__item category__sub__item" :class="f[class_item.key] === item.v ? 'active' : ''"
          @click="handleClickClass(class_item.key, item.v)" v-for="item in class_item.value" :key="item.v">{{ item.n }}
        </li>
      </ul>
    </div>
  </div>
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
    data() {
      this.InitF();
    },
  },
  created() {
    this.InitF();
    //console.log("created：", this.data);
  },
  methods: {
    InitF() {
      this.f = {};
      this.data.forEach(element => {
        this.$set(this.f, element.key, element.value[0].v);
      });
      // console.log("InitF:",this.f);
    },
    handleClickClass(key, value) {
      //console.log("key:",key);
      //console.log("value:",value);
      this.$set(this.f, key, value)
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
</style>
