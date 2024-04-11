import request from '@/utils/request'

export function getModules () {
  return request({
    url: '/module/user/current',
    method: 'get'
  })
}
