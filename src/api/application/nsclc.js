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

export function getAppByDrName(drName) {
  return request({
    url: '/app/nsclc/drname/' + drName,
    method: 'get'
  })
}

export function getAppByPatientName(ptname) {
  return request({
    url: '/app/nsclc/ptname/' + ptname,
    method: 'get'
  })
}
