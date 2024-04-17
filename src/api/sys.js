import request from '@/utils/request'

export function getAllRoles () {
  return request({
    url: '/role',
    method: 'get'
  })
}

export function getAllUsers (params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}
