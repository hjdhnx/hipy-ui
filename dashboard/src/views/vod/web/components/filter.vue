<template>
  <div class="category-layout">
    <div v-for="class_item in data" class="category__line" :key="class_item.name">
      <li class="category__first-ele">{{ class_item.name }}</li>
      <ul class="category__list category__sub">
        <li
          v-for="item in class_item.value"
          :key="item.v"
          class="category__list__item category__sub__item"
          :class="f[class_item.key] === item.v ? 'active' : ''"
          @click="handleClickClass(class_item.key, item.v)"
        >{{ item.n }}
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
.category-layout .category__line {
  display: flex;
  font-size: 14px;
}
.category-layout .category__line .category__first-ele {
  line-height: 32px;
  height: 32px;
  flex-shrink: 0;
  padding-right: 12px;
  border-radius: 2px;
}
.category-layout .category__line li {
  list-style: none;
}
.category-layout .category__line .category__sub {
  line-height: normal;
  margin-bottom: 12px;
}
.category-layout .category__line .category__list {
  font-size: 0;
  position: relative;
}
.category-layout .category__line .category__list .category__list__item {
  display: inline-block;
  cursor: pointer;
  font-size: 16px;
  line-height: 22px;
  color: #606266;
}
.category-layout .category__line .category__list .category__sub__item {
  font-size: 14px;
  line-height: 32px;
  margin-bottom: 2px;
  color: #0c0d0f;
  padding: 0 8px;
  border-radius: 2px;
}
.category-layout .category__line .category__list .active {
  background-color: rgba(0, 0, 0, 0.04);
  color: #fe3355;
  font-weight: 500;
}
.category-layout .category__line .category__list::-webkit-scrollbar {
  display: none;
}
</style>
