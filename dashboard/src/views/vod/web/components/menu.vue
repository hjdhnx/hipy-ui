<template>
  <div class="menu-container">
    <div class="category__list">
      <span
        v-for="item in menuData"
        :key="item.type_id"
        class="category__list__item"
        :class="currentMenu===item.type_id?'active':''"
        @click="handleNav(item.type_id)"
      >
        {{ item.type_name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VodWebMenu',
  components: {},
  props: {
    category: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentMenu: 'index',
      menuData: [{
        type_name: '首页',
        type_id: 'index'
      }]
    }
  },
  watch: {
    '$route.query.t': function() {
      this.currentMenu = this.$route.query.t
    },
    category(newVal) {
      this.menuData = this.menuData.concat(newVal)
    }
  },
  created() {
    this.currentMenu = this.$route.query.t
  },
  methods: {
    handleNav(vid) {
      console.log('this.$route.name:', this.$route.name)
      const query = {}
      if (vid !== 'index') {
        Object.assign(query, { t: vid })
      }
      this.$router.push({
        path: '/vod/web/category',
        query: query
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.menu-container{
  width: 100%;
  padding: 10px 15px;

  .category__list {
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    gap: 20px;
    .category__list__item {
      display: inline-block;
      cursor: pointer;
      font-size: 16px;
      line-height: 22px;
      color: #606266;
      text-align: center;
      //text-overflow: ellipsis;
      //overflow: hidden;
      white-space: nowrap;
    }

    .active {
      color: #0c0d0f;
      font-weight: 500;
      position: relative;
    }

    .active:after {
      position: absolute;
      top: 34px;
      content: " ";
      width: 20px;
      left: 50%;
      transform: translateX(-50%);
      height: 3px;
      background-color: #0c0d0f;
    }

    li {
      list-style: none;
    }
  }

  .category__list:after {
    content: " ";
    display: block;
    height: 1px;
    background-color: rgba(12, 13, 15, .06);
    position: absolute;
    top: 37px;
    left: 0;
    right: 0;
  }
}
</style>
