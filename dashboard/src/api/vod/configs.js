import request from '@/utils/request'

const api_url = '/vods/configs'

// 获取参数
export function getConfigsByKey(key) {
  return request({
    url: api_url + '/key/' + key,
    method: 'get'
  })
}


// 查询参数列表
export function listConfigs(query) {
  return request({
    url: api_url + '/list',
    method: 'get',
    params: query
  })
}


// 获取参数
export function getConfigsById(id) {
  return request({
    url: api_url + '/' + id,
    method: "get"
  })
}


// 获取最大排序
export function getConfigsMaxOrderNum() {
  return request({
    url: api_url + "/max-order-num",
    method: "get"
  })
}


// 添加参数
export function addConfigs(data) {
  return request({
    url: api_url,
    method: "post",
    data: data
  })
}


// 刷新配置
export function refreshConfigs() {
  return request({
    url: api_url + '/refresh',
    method: 'post'
  })
}


// 更新参数
export function setConfigs(id, data) {
  return request({
    url: api_url + "/" + id,
    method: "put",
    data: data
  })
}


// 删除参数
export function delConfigs(id) {
  return request({
    url: api_url + "/" + id,
    method: 'delete'
  })

}

// 清空配置
export function clearRecord() {
  return request({
    url: api_url + '/clear',
    method: 'delete'
  })
}
