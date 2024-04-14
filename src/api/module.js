import request from '@/utils/request'

export function getModules () {
  return request({
    url: '/module/user/current',
    method: 'get'
  })
}

export function saveRoleModule (data) {
  return request({
    url: '/role/module/batch',
    method: 'post',
    data: data
  })
}
