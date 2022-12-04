import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, MyRouteRecordRaw } from 'vue-router'
import Layout from '../views/layout/Layout.vue'
import permission from './permission'

// 导入各个中心路由
import maintenanceRouter from './modules/maintenance'

// 把各个中心路由添加到 动态路由
export const asyncRoutes = [
  ...maintenanceRouter, //运维中心
]

// 路由映射的对应页面
const routes: MyRouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    component: Layout,
    children: [],
  },
  {
    path: '/revisePassword',
    name: 'revisePassword',
    meta: {
      title: '修改密码',
      requiresAuth: true,
    },
    component: () => import('@/views/layout/components/RevisePassword.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      requiresAuth: false,
    },
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      title: '找不到要查询的页面',
      requiresAuth: false,
    },
    component: () => import('@/views/error/NotFound.vue'),
  },
]

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes as RouteRecordRaw[],
})
// 路由权限
permission(router)
export default router
