import type { MyRouteRecordRaw } from 'vue-router'

// 运维中心
const maintenance: MyRouteRecordRaw[] = [
  {
    path: '/userManage',
    name: 'userManage',
    meta: { title: '用户维护', requiresAuth: true },
    component: () => import('@/views/maintenance/userManage.vue'),
  },
]

export default maintenance
