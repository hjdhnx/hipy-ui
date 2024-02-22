import request from '@/utils/request'

const api_url = 'https://www.smarth.fun:8123/api/v1/vod/cntv%E5%A4%AE%E8%A7%86?pwd=dzyyds'
const extend = 'https://www.smarth.fun:8123/files/hipy/cntv央视.json'

/**
 * 主页接口,返回首页推荐列表及分类数据
 * @returns {*}
 * @constructor
 */
export function HomeApi() {
  return request({
    url: api_url,
    responseType: 'json',
    method: 'get',
    params: {
      extend: extend,
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
    url: api_url,
    responseType: 'json',
    method: 'get',
    params: {
      extend: extend,
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
  filters = filters || ''
  return request({
    url: api_url + '&ac=list',
    responseType: 'json',
    method: 'get',
    params: {
      extend: extend,
      filter: true,
      t: t,
      pg: pg,
      ext: filters
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
    url: api_url + '&ac=detail',
    responseType: 'json',
    method: 'get',
    params: {
      extend: extend,
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
    url: api_url,
    responseType: 'json',
    method: 'get',
    params: {
      extend: extend,
      play: play,
      flag: flag,
    }
  })
}
