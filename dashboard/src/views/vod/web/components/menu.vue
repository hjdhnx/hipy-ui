<template>
	<div class="menu-wrap">
		<div class="category__list">
			<div class="category__list__item" :class="currentMenu===item.type_id?'active':''" v-for="item in menuData"
				@click="handleNav(item.type_id)">
				{{ item.type_name }}
			</div>
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
				}],
			}
		},
		created() {
			this.handleNav('index');
		},
		methods: {
			handleNav(vid) {//这里跳转有问题，首页到分类会出现刷新
				this.currentMenu = vid;
        let query = {};
        if(vid !== "index"){
          Object.assign(query,{t:vid})
        }
        this.$router.push({
          path: '/vod/web/category',
          query: query
        });
			}
		},
		watch: {
			category(newVal) {
				this.menuData = this.menuData.concat(newVal);
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	.menu-wrap {
		margin-top: 64px;
		padding: 20px 0 0;

		.category__list {
			width: 100%;
			margin-bottom: 39px;
			font-size: 0;
			position: relative;
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
