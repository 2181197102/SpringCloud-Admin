import request from '@/utils/request'

export function uploadFileImage(data) {
  return request({
    url: '/app/nsclc/file/upload/image',
    method: 'post',
    data
  })
}

export function uploadFileMask(data) {
  return request({
    url: '/app/nsclc/file/upload/mask',
    method: 'post',
    data
  })
}

export function predict(data) {
  return request({
    url: '/app/nsclc/predict',
    method: 'post',
    data
  })
}

export function saveDiag(data) {
  return request({
    url: '/app/nsclc/save/diag',
    method: 'post',
    data
  })
}

export function queryNsclc(data) {
  return request({
    url: '/app/nsclc/conditions',
    method: 'post',
    data
  })
}

export function getNsclc(diagnosisCode) {
  return request({
    url: '/app/nsclc/' + diagnosisCode,
    method: 'get'
  })
}

export function updateNsclc(data) {
  return request({
    url: '/app/nsclc/' + data.diagnosisCode,
    method: 'put',
    data
  })
}

export function deleteNsclc(diagnosisCode) {
  return request({
    url: '/app/nsclc/' + diagnosisCode,
    method: 'delete'
  })
}

export function queryAllNsclc() {
  return request({
    url: '/app/nsclc/all',
    method: 'get'
  })
}

export function uploadModel(data) {
  return request({
    url: '/app/nsclc/model/file/upload/model',
    method: 'post',
    data
  })
}

export function saveModelInfo(data) {
  return request({
    url: '/app/nsclc/model/save',
    method: 'post',
    data
  })
}

export function queryModel(data) {
  return request({
    url: '/app/nsclc/model/conditions',
    method: 'post',
    data
  })
}

export function getModel(modelCode) {
  return request({
    url: '/app/nsclc/model/' + modelCode,
    method: 'get'
  })
}

export function updateModel(data) {
  return request({
    url: '/app/nsclc/model/' + data.modelCode,
    method: 'put',
    data
  })
}

export function deleteModel(modelCode) {
  return request({
    url: '/app/nsclc/model/' + modelCode,
    method: 'delete'
  })
}

export function queryAllModel() {
  return request({
    url: '/app/nsclc/model/all',
    method: 'get'
  })
}
