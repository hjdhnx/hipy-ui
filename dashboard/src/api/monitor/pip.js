import request from '@/utils/request'

const api_url = '/monitor/pip'

// 查询列表
export function searchRecords(query) {
  return request({
    url: api_url,
    method: 'get',
    params: query
  })
}

// 查询详细
export function getRecord(id) {
  return request({
    url: api_url + '/' + id,
    method: 'get'
  })
}

// 新增
export function addRecord(data) {
  return request({
    url: api_url,
    method: 'post',
    data: data,
    timeout: 60*1000
  })
}

// 修改
export function setRecord(id, data) {
  return request({
    url: api_url + '/' + id,
    method: 'put',
    data: data
  })
}

// 删除
export function delRecord(id) {
  return request({
    url: api_url + '/' + id,
    method: 'delete'
  })
}
