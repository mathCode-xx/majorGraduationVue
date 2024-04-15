import request from '@/utils/request'

export function getUserModules () {
  return request({
    url: '/module/user/current',
    method: 'get'
  })
}

export function getAllModules () {
  return request({
    url: '/module/all',
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

export function deleteModule (params) {
  return request({
    url: '/module/batch',
    method: 'delete',
    params: {
      moduleIds: params
    }
  })
}
