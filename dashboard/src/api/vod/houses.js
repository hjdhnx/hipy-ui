import request from '@/utils/request'

const api_url = '/vods/houses'


// 获取仓库源列表
export function listHouses(query) {
  return request({
    url: api_url + '/list',
    method: 'get',
    params: query
  })
}

// 从id导入源
export function addHouses(id) {
  return request({
    url: api_url + "/" + id,
    method: 'put'
  })
}

// 刷新仓库源
export function refreshHouses() {
  return request({
    url: api_url + '/refresh',
    method: 'post'
  })
}
