import Vue from 'vue'
import Router from 'vue-router'

// 挂载 Vue-Router 插件，使其在整个 Vue 应用中可用
Vue.use(Router)

/* Layout 布局组件 */
import Layout from '@/layout'

/* 引入路由模块：组织架构和 DevOps 功能 */
import organizationRouter from './modules/organization'
import devopsRouter from './modules/deops'

/**
 * 路由配置说明：
 * hidden: true            // 不在侧边栏中显示该路由
 * alwaysShow: true        // 永远显示根菜单，哪怕只有一个子路由
 * redirect: noRedirect    // 不在面包屑导航中进行重定向
 * name: 'router-name'     // 用于 <keep-alive> 缓存，必须设置
 * meta: {                 // 路由附加信息
 *   roles: ['admin','editor'] // 控制页面权限，可以设置多个角色
 *   title: '标题'            // 在侧边栏和面包屑中展示的名称
 *   icon: 'svg-name'         // 侧边栏中的图标
 *   noCache: true            // 页面不被缓存
 *   affix: true              // 固定在标签栏
 *   breadcrumb: false        // 在面包屑中隐藏
 *   activeMenu: '/path'      // 设置高亮的侧边栏路径
 * }
 */

/**
 * 常量路由：无需权限即可访问的基础页面，所有角色均可访问
 */
export const constantRoutes = [
  {
    path: '/redirect', // 重定向页面，用于内部跳转处理
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login', // 登录页面
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect', // 第三方授权重定向回调
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404', // 404 错误页面
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401', // 401 权限不足页面
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/', // 应用根路径，重定向到仪表盘
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard', // keep-alive 名称
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/nsclc', // nsclc 应用路由，隐藏侧边栏
    component: () => import('@/views/application/nsclc/layout/Index.vue'),
    hidden: true,
    meta: { title: 'nsclc疗效评估' },
    children: [
      {
        path: '/nsclc',
        name: 'nsclcIndex',
        component: () => import('@/views/application/nsclc/upload.vue'),
        meta: {
          title: 'NSCLC疗效评估',
          requireAuth: true, // 需要登录权限
          affix: true
        }
      },
      {
        path: '/nsclc/upload', // 上传功能
        name: 'Upload',
        component: () => import('@/views/application/nsclc/upload.vue'),
        meta: {
          title: 'NSCLC疗效评估',
          requireAuth: true
        }
      },
      {
        path: '/nsclc/search', // 搜索页面
        name: 'Search',
        component: () => import('@/views/application/nsclc/search.vue'),
        meta: {
          title: '搜索',
          requireAuth: true
        }
      },
      {
        path: '/nsclc/401', // 专用 401 页面
        name: '401',
        component: () => import('@/views/application/nsclc/401.vue'),
        meta: { title: '401' }
      },
      {
        path: '/nsclc/model', // 模型详情或配置
        name: 'model',
        component: () => import('@/views/application/nsclc/model.vue'),
        meta: {
          title: '模型',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/profile', // 个人中心
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * 异步路由：基于用户角色动态加载，需要权限验证的页面
 */
export const asyncRoutes = [
  // 按模块拆分的大型路由表
  organizationRouter,
  devopsRouter,
  // 外部链接示例：跳转到 GitHub
  {
    path: '/github',
    component: Layout,
    children: [
      {
        path: 'https://github.com/2181197102/SpringCloud-Admin',
        meta: { title: 'Github地址', icon: 'link' }
      }
    ]
  },
  {
    path: '/icon', // 图标展示页面
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  // 404 页面放在最后，未匹配到路由时重定向到 404
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * 创建 Router 实例，使用常量路由作为初始路由表
 */
const createRouter = () => new Router({
  // mode: 'history', // 使用 history 模式，需要服务器支持
  scrollBehavior: () => ({ y: 0 }), // 页面滚动行为，始终滚到顶部
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由表，用于登出后或切换权限时清空已注册的路由
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由匹配器
}

export default router // 默认导出 router 实例
