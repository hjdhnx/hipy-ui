import request from '@/utils/request'

// 查询列表
export function searchRecords(query) {
  return request({
    url: '/hiker/hiker_developer',
    method: 'get',
    params: query
  })
}

// 查询详细
export function getRecord(id) {
  return request({
    url: '/hiker/hiker_developer/' + id,
    method: 'get'
  })
}

// 新增
export function addRecord(data) {
  return request({
    url: '/hiker/hiker_developer',
    method: 'post',
    data: data
  })
}

// 修改
export function setRecord(id, data) {
  return request({
    url: '/hiker/hiker_developer/' + id,
    method: 'put',
    data: data
  })
}

// 删除
export function delRecord(id) {
  return request({
    url: '/hiker/hiker_developer/' + id,
    method: 'delete'
  })
}

//修改开发者是否超管
export function changeIsManager(id, is_manager) {
  return request({
    url: "/hiker/hiker_developer/" + id + "/is_manager",
    method: 'put',
    data: {'is_manager': is_manager}
  })
}

// 修改开发者是否启用
export function changeActive(id, active) {
  return request({
    url: "/hiker/hiker_developer/" + id + "/active",
    method: 'put',
    data: {'active': active}
  })
}
