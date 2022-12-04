import type { MyRouteRecordRaw } from 'vue-router'

// 运维中心
export default [
  {
    path: '/userManage',
    name: 'userManage',
    meta: { title: '用户维护', requiresAuth: true },
    component: () => import('@/views/maintenance/userManage.vue'),
  },
] as MyRouteRecordRaw[]
