import request from '@/utils/request'

// /**
//  * 根据 ID 获取甲病信息
//  * GET /nail/nail-diseases/{id}
//  */
// export function getNailDiseaseById(id) {
//   return request({
//     url: `/nail/nail/nail-diseases/${id}`,
//     method: 'get'
//   })
// }

/**
 * 添加甲病信息
 * POST /nail/nail-diseases
 */
export function addNailDisease(data) {
  return request({
    url: '/nail/nail/nail-diseases',
    method: 'post',
    data
  })
}

/**
 * 更新甲病信息（原 PUT 改为 POST）
 * POST /nail/nail-diseases/update
 */
export function updateNailDisease(data) {
  return request({
    url: '/nail/nail/nail-diseases/update',
    method: 'post',
    data
  })
}

/**
 * 删除甲病信息（原 DELETE 改为 POST）
 * POST /nail/nail-diseases/delete/{id}
 */
export function deleteNailDiseaseById(id) {
  return request({
    url: `/nail/nail/nail-diseases/delete/${id}`,
    method: 'post'
  })
}

/**
 * 获取所有甲病信息
 * GET /nail/nail-diseases
 */
export function getAllNailDiseases() {
  return request({
    url: '/nail/nail/nail-diseases',
    method: 'get'
  })
}

/**
 * 查询诊断信息（分页，不做额外 VO 转换，直接返回实体）
 * POST /nail/search
 * @param {object} queryForm       // 对应 NailDiagQueryForm，含 page、查询条件等
 */
export function searchDiagnoses(queryForm) {
  return request({
    url: '/nail/nail/search',
    method: 'post',
    data: queryForm
  })
}

/**
 * 更新诊断信息
 * POST /nail/update/{diagnosisCode}
 * @param {string} diagnosisCode
 * @param {object} data            // NailDiagUpdateForm 对应的字段
 */
export function updateDiagnosis(diagnosisCode, data) {
  return request({
    url: `/nail/nail/update/${diagnosisCode}`,
    method: 'post',
    data
  })
}

/**
 * 删除诊断信息
 * POST /nail/delete/{diagnosisCode}
 * @param {string} diagnosisCode
 */
export function deleteDiagnosis(diagnosisCode) {
  return request({
    url: `/nail/nail/delete/${diagnosisCode}`,
    method: 'post'
  })
}

/**
 * 获取需要归类的疾病列表（cnt >= 5 且未归类的记录）
 * GET /nail/disease-classification/list
 */
export function getDiseasesForClassification() {
  return request({
    url: '/nail/nail/disease-classification/all4dc',
    method: 'get'
  })
}

/**
 * 获取某个诊断的医生审核记录
 * GET /nail/disease-classification/doctor-records/{diagnosisCode}
 * @param {string} diagnosisCode
 */
export function getDoctorRecordsByDiagnosisCode(diagnosisCode) {
  return request({
    url: `/nail/nail/disease-classification/doctor-records/${diagnosisCode}`,
    method: 'get'
  })
}

/**
 * 进行疾病归类
 * POST /nail/disease-classification/classify
 * @param {string} diagnosisCode
 * @param {string} diagResult      // 新的诊断结果名称
 */
export function classifyDisease(diagnosisCode, diagResult) {
  return request({
    url: '/nail/nail/disease-classification/classify',
    method: 'post',
    data: {
      diagnosisCode,
      diagResult
    }
  })
}

/**
 * 获取图片
 * GET /nail/image
 * @param {string} path            // 图片路径
 */
export function getImage(path) {
  return request({
    url: '/nail/nail/wxxcx/image',
    method: 'get',
    params: { path },
    responseType: 'blob' // 设置响应类型为blob以处理二进制图片数据
  })
}
