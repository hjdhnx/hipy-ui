import request from '@/utils/request'
import {base64Encode, base64Decode} from "@/utils/jsencrypt";
import cache from "@/plugins/cache"

const config_url = new URL(process.env.VUE_APP_BASE_API).origin + '/config/0'

export const now_site = {
  api_url: process.env.VUE_APP_BASE_API + 'vod/cntv%E5%A4%AE%E8%A7%86?pwd=dzyyds&sub=dzyyds',
  extend: new URL(process.env.VUE_APP_BASE_API).origin + '/files/hipy/cntv央视.json'
}

function get_now_site(){
  let cacheSite = cache.local.getJSON('hipy_site');
  if (cacheSite) {//读取缓存
    console.log('当前存在缓存首页源:', cacheSite.name)
    now_site.api_url = cacheSite.api
    now_site.extend = cacheSite.ext
  }
}

/**
 * 配置接口,返回tvbox配置数据
 * @returns {*}
 * @constructor
 */
export function ConfigApi() {
  get_now_site()
  return request({
    url: config_url,
    responseType: 'json',
    method: 'get',
    params: {}
  })
}

/**
 * 主页接口,返回首页推荐列表及分类数据
 * @returns {*}
 * @constructor
 */
export function HomeApi() {
  return request({
    url: now_site.api_url,
    responseType: 'json',
    method: 'get',
    timeout: 10*1000,
    params: {
      extend: now_site.extend,
      filter: true,
    }
  })
}

/**
 * 搜索接口
 * @param wd 搜索关键词
 * @param pg 页数
 * @returns {*}
 * @constructor
 */
export function SearchApi(wd, pg) {
  pg = pg || 1;
  return request({
    url: now_site.api_url,
    responseType: 'json',
    method: 'get',
    timeout: 10*1000,
    params: {
      extend: now_site.extend,
      wd: wd,
      pg: pg
    }
  })
}


/**
 * 一级/分类 接口
 * @param t 分类id
 * @param pg 页数
 * @param filters  筛选json的base64结果: 如 {"area":"大陆"}
 * @returns {*}
 * @constructor
 */
export function CateGoryApi(t, pg, filters) {
  pg = pg || 1;
  filters = filters || {}
  let ext_filters = base64Encode(JSON.stringify(filters))
  return request({
    url: now_site.api_url + '&ac=list',
    responseType: 'json',
    method: 'get',
    timeout: 10*1000,
    params: {
      extend: now_site.extend,
      filter: true,
      t: t,
      pg: pg,
      ext: ext_filters
    }
  })
}


/***
 * 二级/详情 接口
 * @param ids 视频id,多个用逗号隔开，一般只有一个。网页就传的 视频的详情页url链接
 * @returns {*}
 * @constructor
 */
export function DetailApi(ids) {
  return request({
    url: now_site.api_url + '&ac=detail',
    responseType: 'json',
    method: 'get',
    timeout: 10*1000,
    params: {
      extend: now_site.extend,
      ids: ids,
    }
  })
}


/***
 * 播放接口
 * @param play 视频播放页地址
 * @param flag 线路名称
 * @returns {*}
 * @constructor
 */
export function PlayApi(play, flag) {
  flag = flag || '';
  return request({
    url: now_site.api_url,
    responseType: 'json',
    method: 'get',
    timeout: 10*1000,
    params: {
      extend: now_site.extend,
      play: play,
      flag: flag,
    }
  })
}
