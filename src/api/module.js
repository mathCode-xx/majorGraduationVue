import request from '@/utils/request'

export function getUserModules () {
  return request({
    url: '/module/user/current',
    method: 'get'
  })
}

export function getModules (params) {
  return request({
    url: '/module',
    method: 'get',
    params
  })
}

export function saveRoleModule (data) {
  return request({
    url: '/role/module/batch',
    method: 'post',
    data: data
  })
}

export function deleteModule (params) {
  return request({
    url: '/module/batch',
    method: 'delete',
    params: {
      moduleIds: params
    }
  })
}

export function saveModule (data) {
  return request({
    url: '/module',
    method: 'post',
    data
  })
}
