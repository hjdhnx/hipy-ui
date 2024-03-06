<template>
  <div class="category-container">
    <div class="category-content">
      <div v-for="class_item in data" :key="class_item.name" class="category__line">
        <h3 class="category__first-ele">{{ class_item.name }}</h3>
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
      f: {} // 筛选变量
    }
  },
  watch: {
    data() {
      this.InitF()
    }
  },
  created() {
    this.InitF()
    // console.log("created：", this.data);
  },
  methods: {
    InitF() {
      this.f = {}
      this.data.forEach(element => {
        this.$set(this.f, element.key, element.value[0].v)
      })
      // console.log("InitF:",this.f);
    },
    handleClickClass(key, value) {
      // console.log("key:",key);
      // console.log("value:",value);
      this.$set(this.f, key, value)
      // console.log("filterSelected:",this.f);
      this.$emit('filterSelected', this.f)
    }
  }
}

</script>

<style lang="scss" scoped>
.category-container {
  font-size: 13px;
  line-height: 28px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%;
  padding: 0 15px;
  .category-content {
    background: #f8f8f8;
    padding: 5px 0;
  }
  .category__line {
    padding-bottom: 15px;
    // display: flex;
    // flex-direction: row;
    // flex-wrap: nowrap;
    // align-items: center;
    // justify-content: flex-start;
    .category__first-ele {
      float: left;
      vertical-align: top;
      padding-left: 20px;
      width: 79px;
      font-size: 14px;
      line-height: 26px;
      color: #999;
      font-weight: 600;
    }
    .category__sub {
      float: left;
      width: auto;
      padding-right: 4px;
      width: calc(100% - 80px);
      vertical-align: top;
      .category__list__item {
        display: inline-block;
        height: 26px;
        padding: 0 11px;
        border-radius: 26px;
        text-align: center;
        cursor: pointer;
      }
      .active {
        background: #efefef;
        color: #00be06;
        font-weight: 500;
      }
    }
  }
}
</style>
