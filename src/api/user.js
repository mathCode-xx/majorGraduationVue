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

export function saveUser (data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}

export function getCurrentInfo () {
  return request({
    url: '/user/current',
    method: 'get'
  })
}

export function flushToke (flushToken) {
  return request({
    url: '/user/token',
    method: 'put',
    headers: {
      flushToken
    }
  })
}

export function checkPhoneExist (phoneNumber) {
  return request({
    url: '/user/check/phone',
    method: 'get',
    params: {
      phoneNumber
    }
  })
}

export function checkIdCardExist (idCard) {
  return request({
    url: '/user/check/idCard',
    method: 'get',
    params: {
      idCard
    }
  })
}
