// 路由权限
import type { Router } from 'vue-router'
import { getPageTitle } from '@/utils/get-page-title'
import { useUserStore } from '@/stores/user'

export default (router: Router) => {
  // 前置守卫
  router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    const token = userStore.userInfo && userStore.userInfo.Token

    if (token) {
      // 如果有token
      const message = userStore.userInfo && userStore.userInfo.Message
      if (message === '密码过期') {
        // 如果密码过期
        if (to.name === 'revisePassword') {
          return true
        } else {
          return { name: 'revisePassword', replace: true }
        }
      } else if (message === '会话过期') {
        await userStore.userLogout(false)
        return { name: 'login', replace: true }
      } else {
        if (to.name === 'login') {
          // 如果去的是登陆页 - 回到主页
          if (userStore.userInfo && userStore.userInfo.UserId) {
            return { name: 'layout' }
          } else {
            userStore.clearUserData()
            return true
          }
        } else {
          // 如果去的不是登陆页 并且没有菜单
          if (!userStore.loading.systemList) {
            // 获取菜单
            await userStore.getSytemListAndMenu()

            return {
              path: to.path,
              replace: true,
            }
          } else {
            return true
          }
        }
      }
    } else {
      // 如果没有token
      if (to.meta.requiresAuth) {
        // 查看当前页面是否需要权限 - 去登陆
        return { name: 'login' }
      } else {
        // 不需要权限 - 通过
        return true
      }
    }
  })

  router.beforeEach(async (to) => {
    // 设置标题
    document.title = getPageTitle(to.meta.title)
    return true
  })
}
