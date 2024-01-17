import request from '@/utils/request'

const api_url = '/monitor/logininfor'

// 查询登录日志列表
export function list(query) {
  return request({
    url: api_url + '/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delRecord(id) {
  return request({
    url: api_url + '/' + id,
    method: 'delete'
  })
}

// 解锁用户登录状态
export function unlockLogininfor(userName) {
  return request({
    url: '/monitor/logininfor/unlock/' + userName,
    method: 'get'
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: api_url + '/clean',
    method: 'delete'
  })
}
