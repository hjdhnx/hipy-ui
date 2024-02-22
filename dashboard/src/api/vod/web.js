import request from '@/utils/request'

const api_url = 'https://www.smarth.fun:8123/api/v1/vod/cntv%E5%A4%AE%E8%A7%86?pwd=dzyyds'


// 主页
export function HomeApi() {
  return request({
    url: api_url,
    responseType:'json',
    method: 'get',
  })
}

// 搜索
export function SearchApi(wd) {
  return request({
    url: api_url+'&wd='+wd,
    responseType:'json',
    method: 'get',
  })
}
