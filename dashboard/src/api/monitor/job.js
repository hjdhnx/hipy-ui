import request from '@/utils/request'

const api_url = '/monitor/job'

// 查询定时任务调度列表
export function listJob(query) {
  return request({
    url: api_url + '/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export function getJob(id) {
  return request({
    url: api_url + '/' + id,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data) {
  return request({
    url: api_url,
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data) {
  return request({
    url: api_url,
    method: 'put',
    data: data
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

// 删除定时任务调度
export function delRecord(id) {
  return request({
    url: api_url + '/' + id,
    method: 'delete'
  })
}

// 任务状态修改
export function changeJobStatus(id, status) {
  const data = {
    status
  }
  return request({
    url: api_url + '/' + id + '/status',
    method: 'put',
    data: data
  })
}

// 修改是否启用
export function changeActive(id, active) {
  return request({
    url: api_url + '/' + id + '/active',
    method: 'put',
    data: {'active': active}
  })
}


// 定时任务立即执行一次
export function runJob(id) {
  return request({
    url: api_url + `/${id}/run`,
    method: 'put',
  })
}
