import request from '@/utils/request'

export function getOrganization (params) {
  return request({
    url: '/organization',
    method: 'get',
    params
  })
}

export function saveOrganization (data) {
  return request({
    url: '/organization',
    method: 'post',
    data
  })
}

export function deleteOrganization (params) {
  return request({
    url: '/organization',
    method: 'delete',
    params
  })
}

export function updateOrganization (data) {
  return request({
    url: '/organization',
    method: 'put',
    data
  })
}
