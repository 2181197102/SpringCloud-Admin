import request from '@/utils/request'

export function queryApp(data) {
  return request({
    url: '/organization/app/conditions',
    method: 'post',
    data
  })
}

export function getApp(id) {
  return request({
    url: '/organization/app/' + id,
    method: 'get'
  })
}

export function createApp(data) {
  return request({
    url: '/organization/app',
    method: 'post',
    data
  })
}

export function updateApp(data) {
  return request({
    url: '/organization/app/' + data.id,
    method: 'put',
    data
  })
}

export function deleteApp(id) {
  return request({
    url: '/organization/app/' + id,
    method: 'delete'
  })
}

export function queryAllApp() {
  return request({
    url: '/organization/app/all',
    method: 'get'
  })
}

export function getAppByUserId(userId) {
  return request({
    url: '/organization/app/user/' + userId,
    method: 'get'
  })
}
