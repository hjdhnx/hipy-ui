import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import Cookies from 'js-cookie'

import md5 from 'js-md5'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
// import VueCodemirror from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css
import '@/styles/ruoyi.scss' // ruoyi css


import App from './App'
import store from './store'
import router from './router'
import plugins from './plugins' // plugins

// import './icons' // icon
import './assets/icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import {getDicts} from '@/api/system/dict/data'
import {resetForm, selectDictLabel, download, handleTree, parseTime, addDateRange} from '@/utils/ruoyi'
import {getFormatTime} from '@/utils/index'
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'

import * as filters from './filters'
import {getParameter} from "@/api/system/parameter"; // global filters


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getParameter = getParameter
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.parseTime = parseTime
Vue.prototype.getFormatTime = getFormatTime
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function (msg) {
  this.$message({showClose: true, message: msg, type: 'success'})
}

Vue.prototype.msgError = function (msg) {
  this.$message({showClose: true, message: msg, type: 'error'})
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

Vue.prototype.$md5 = md5

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('ImagePreview', ImagePreview)

// 按钮级别权限配置
import button_permission from './directive/button_permission'

Vue.use(button_permission)
Vue.use(plugins)
Vue.use(VueClipboard)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// Vue.use(VueCodemirror, /* {
//   options: { theme: 'base16-dark', ... },
//   events: ['scroll', ...]
// } */)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
