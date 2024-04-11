import request from '@/utils/request'

export function getModules (token) {
  return request({
    url: '/module/user',
    method: 'get',
    params: { token }
  })
}
