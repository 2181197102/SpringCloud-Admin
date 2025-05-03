/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nailRouter = {
  path: '/nail',
  component: Layout,
  redirect: '/nail/diseases_management',
  name: 'nail',
  meta: {
    title: '甲病服务管理',
    icon: 'shijia_logo'
  },
  children: [
    {
      path: '/nail/diseases_management',
      component: () => import('@/views/nail/diseases_management'),
      name: 'diseases_management',
      meta: {
        title: '甲病管理',
        icon: 'table'
      }
    },
    {
      path: '/nail/naildiag_management',
      component: () => import('@/views/nail/naildiag_management'),
      name: 'naildiag_management',
      meta: {
        title: '病历管理',
        icon: 'documentation'
      }
    },
    {
      path: '/nail/diseases_classification',
      component: () => import('@/views/nail/diseases_classification'),
      name: 'diseases_classification',
      meta: {
        title: '病种归类',
        icon: 'tree'
      }
    }
  ]
}

export default nailRouter
