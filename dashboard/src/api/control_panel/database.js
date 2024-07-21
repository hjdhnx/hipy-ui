import request from '@/utils/request'

const api_url = '/database_update'

// 修改
export function setRecord(data) {
  return request({
    baseURL: new URL(process.env.VUE_APP_BASE_API).origin,
    url: api_url,
    method: 'put',
    data: data,
    timeout: 60 * 1000
  })
}

export function getVersion() {
  return request({
    baseURL: new URL(process.env.VUE_APP_BASE_API).origin,
    url: '/version',
    method: 'get',
    timeout: 5 * 1000
  })
}
