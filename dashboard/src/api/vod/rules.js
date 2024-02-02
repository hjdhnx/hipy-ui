import request from '@/utils/request'

const api_url = '/vods/rules'

// 查询源列表
export function list(query) {
  return request({
    url: api_url + '/list',
    method: 'get',
    params: query
  })
}

// 查询源详细
export function getRule(id) {
  return request({
    url: api_url + '/' + id,
    method: 'get'
  })
}

// 查询源详细
export function getRuleRaw(id) {
  return request({
    url: api_url + '/raw/' + id,
    method: 'get'
  })
}

// 查询源码
export function getRawContent(url) {
  return request({
    url: url,
    responseType: 'text',
    method: 'get'
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

// 修改排序
export function setOrderNum(id, order_num) {
  return request({
    url: api_url + '/' + id + '/order_num',
    method: 'put',
    data: {order_num: order_num}
  })
}

// 修改
export function saveRecordContent(id, content) {
  return request({
    url: api_url + '/raw/' + id,
    method: 'put',
    data: {content: content}
  })
}

// 刷新源
export function refreshRules() {
  return request({
    url: api_url + '/refresh',
    method: 'post'
  })
}

//上传源
export async function uploadRules(formData, query) {
  return request({
    url: api_url + '/file/uploadData',
    method: 'post',
    data: formData,
    params: query
  })
}

// 删除源
export function delRecord(id, query) {
  query = query || {};
  return request({
    url: api_url + '/' + id,
    method: 'delete',
    params: query,
  })
}

// 修改是否启用|显示
export function changeActive(id, active) {
  return request({
    url: api_url + '/' + id + '/active',
    method: 'put',
    data: {'active': active}
  })
}


// 清空源
export function clearRecord() {
  return request({
    url: api_url + '/clear',
    method: 'delete'
  })
}
