import request from '@/utils/request'

export function getRoles (params) {
  return request({
    url: 'role',
    method: 'get',
    params
  })
}

export function deleteRole (params) {
  return request({
    url: 'role',
    method: 'delete',
    params
  })
}

export function updateRole (data) {
  return request({
    url: 'role',
    method: 'put',
    data
  })
}

export function saveRole (data) {
  return request({
    url: 'role',
    method: 'post',
    data
  })
}

export function checkRoleName (params) {
  return request({
    url: 'role/name',
    method: 'get',
    params
  })
}
