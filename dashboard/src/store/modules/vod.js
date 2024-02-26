// 初始化状态
const state = {
	recommend: [],
	filters: {
		"电视剧": "aa"
	}
};

// 修改状态的方法
const mutations = {
	SET_Filters: (filters) => {
		state.filters = filters
	},
	SET_Recommend: (recommend) => {
		state.recommend = recommend
	},
};

// 包含异步操作或其他逻辑处理的方法
const actions = {
	getfilters(categoryName) {
		if (Object.prototype.hasOwnProperty.call(filters, categoryName)) {
			const tvSeries = filters[categoryName];
			console.log(tvSeries);
			return tvSeries;
		} else {
			console.log("filters 中不包含键 " + categoryName);
			return [];
		}
	}
};

export default {
	namespaced: true, // 可选：启用命名空间
	state,
	mutations,
	actions
};

