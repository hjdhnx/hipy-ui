import request from '@/utils/request'


const api_url = '/vods/subs'


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
    data: data
  })
}

// 修改
export function setRecord(id, data) {
  console.log(data);
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

export function enableRecords(ids) {
  return request({
    url: api_url + '/enable/' + ids,
    method: 'put'
  })
}

export function disableRecords(ids) {
  return request({
    url: api_url + '/disable/' + ids,
    method: 'put'
  })
}
