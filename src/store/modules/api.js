const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 注册中心
    nacosServer: 'http://centos:8848/nacos',
    sentinelDashboard: 'http://centos:8021',
    mossServer: 'http://centos:8022',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
  }
}

export default api
