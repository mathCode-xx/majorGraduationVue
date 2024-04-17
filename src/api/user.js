import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function updateUserInfo (data) {
  return request({
    url: 'user',
    method: 'put',
    data
  })
}

export function deleteUser (params) {
  return request({
    url: 'user',
    method: 'delete',
    params
  })
}
