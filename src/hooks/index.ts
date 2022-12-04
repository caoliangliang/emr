import type { FormInstance } from 'element-plus'
import type {
  UserMenuNodeDto,
  UserSystemDto,
  UserChangePwdDto,
} from '@/api/maint/types'
import { getCurrentPublicKey } from '@/api/maint'
import router, { asyncRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { JSEncrypt } from 'jsencrypt'

/**
 * element-plus表单验证
 * @param FormRef true/false
 * @returns
 */
export const useValidate = async (FormRef: FormInstance | undefined) => {
  if (!FormRef) return false
  return await FormRef.validate().catch(() => false)
}

/**
 * 添加路由记录 layout
 * @param
 * @returns
 */
export const useAddRoute = async (menuList: UserMenuNodeDto[]) => {
  // 访问权限处理
  const filterRoutes = asyncRoutes.filter((route) => {
    return menuList.some((item) => item.Component === route.name)
  })

  // 添加路由
  for (let index = 0; index < filterRoutes.length; index++) {
    router.addRoute('layout', filterRoutes[index] as RouteRecordRaw)
  }
}

/**
 * 获取当前系统
 * @returns
 */
export const useCurrentSystem = (): [UserSystemDto, UserMenuNodeDto] => {
  const route = useRoute()
  const userStore = useUserStore()

  let system = null
  let menu = null
  if (route.path === '/') {
    system = userStore.systemList.SystemList[0]
    menu = useGetFirstMenus(userStore.systemMenuObj[system.SystemCode][0])
  } else {
    const cur = userStore.menuList.find((item) =>
      route.path.includes(item.Component),
    )
    system = cur!
    menu = cur!
  }
  return [system, menu]
}

// 获取第一层的点击菜单
export const useGetFirstMenus = (menusList: UserMenuNodeDto) => {
  let menu = menusList
  if (menusList.Children.length > 0) {
    menu = useGetFirstMenus(menusList.Children[0])
  }
  return menu
}

/**
 * 修改密码公钥
 * @returns
 */
export const getPwdPublicKey = async (pwdForm: UserChangePwdDto) => {
  const { data } = await getCurrentPublicKey()
  const jse = new JSEncrypt()
  jse.setPublicKey(data)
  // 进行加密
  pwdForm.OldPassword = jse.encrypt(pwdForm.OldPassword) as string
  pwdForm.Password = jse.encrypt(pwdForm.Password) as string
  pwdForm.RePassword = jse.encrypt(pwdForm.RePassword) as string
  const userStore = useUserStore()
  pwdForm.UserId = userStore.userInfo.UserId!
  return pwdForm
}
