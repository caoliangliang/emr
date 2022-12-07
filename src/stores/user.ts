import type {
  UserLoginDto,
  UserTokenInfoDto,
  SettingsDto,
  UserProfileDto,
  UserLicenseSystemDto,
  UserMenuNodeDto,
  UserSystemDto,
  VersionDto,
} from '@/api/maint/types'
import type { AxiosResponse } from 'axios'
import { userAPI, accountAPI, localAPI } from '@/api/maint'
import { setStroage, getStroage, clearStorage } from '@/utils/stroage'
import router from '@/router'
import { menuListFlat } from '@/utils'
import { useAddRoute } from '@/hooks'

// 类型
type UserSystemAndMenu = UserMenuNodeDto & UserSystemDto
type PartialUserInfo = UserLoginDto &
  UserTokenInfoDto & {
    UserId?: number
  }
interface SystemMenuOBJ {
  [n: string]: UserMenuNodeDto[]
}
type UserType = {
  userInfo: PartialUserInfo
  settings: SettingsDto
  profile: Partial<UserProfileDto>
  systemList: UserLicenseSystemDto
  menuList: UserSystemAndMenu[]
  systemMenuObj: SystemMenuOBJ
  version: VersionDto
  loading: {
    version: boolean
    systemList: boolean
    settings: boolean
  }
}

// 用户store
export const useUserStore = defineStore('user', {
  state: (): UserType => ({
    userInfo: getStroage('userInfo'),
    settings: {},
    profile: {},
    systemList: { SystemList: [], LicenseMessage: '' },
    menuList: [],
    systemMenuObj: {},
    version: {},
    loading: {
      version: false,
      systemList: false,
      settings: false,
    },
  }),
  getters: {},
  actions: {
    // 获取本地版本文件
    async getVersion() {
      if (this.loading.version) return this.version
      const { data } = await localAPI.getVersionNote()
      this.version = data
      this.loading.version = true
      return this.version
    },

    // 获取系统和菜单
    async getSytemListAndMenu(): Promise<{
      menuList: UserSystemAndMenu[]
      systemList: UserLicenseSystemDto
    }> {
      if (this.loading.systemList)
        return {
          menuList: this.menuList,
          systemList: this.systemList,
        }

      // 获取系统
      const { data } = await userAPI.getSystemByHospitalCode({
        hospitalCode: this.userInfo.HospitalCode,
      })
      this.systemList = data

      // 获取菜单
      const promisArr: Promise<AxiosResponse<UserMenuNodeDto[], any>>[] = []
      data.SystemList.forEach((item) =>
        promisArr.push(
          userAPI.getMenuBysystemCode({ systemCode: item.SystemCode }),
        ),
      )
      const resMenu = await Promise.all(promisArr)
      data.SystemList.forEach((item, i) => {
        this.systemMenuObj[item.SystemCode] = resMenu[i].data
      })
      this.menuList = resMenu.flatMap((item, i) => {
        return menuListFlat(item.data).map((tag) => ({
          ...tag,
          ...data.SystemList[i],
        }))
      })

      // 注册路由
      await useAddRoute(this.menuList)

      // 赋值
      this.loading.systemList = true
      return {
        menuList: this.menuList,
        systemList: this.systemList,
      }
    },
    // 更新userInfo
    updateUserInfo(userInfo: PartialUserInfo) {
      // 存储到localStorage
      setStroage<PartialUserInfo>('userInfo', userInfo)
      this.userInfo = userInfo
    },
    // 更新个人信息
    updateProfile(profile: UserProfileDto) {
      this.profile = profile
      this.userInfo = {
        ...this.userInfo,
        UserId: this.profile.UserId,
      }
      setStroage<PartialUserInfo>('userInfo', this.userInfo)
    },
    // 更新设置
    async updateSettings() {
      const { data } = await localAPI.getSettings()
      this.settings = data
      this.loading.settings = true
    },

    // 退出登录
    async userLogout(isPush: boolean = true) {
      // 退出登录接口
      await accountAPI.userLogoutApi()
      this.clearUserData()
      // 跳转登录页面
      if (isPush) await router.push('/login')
    },

    // 清除用户信息
    clearUserData() {
      // 清空 Storage
      clearStorage()
      // 状态 重置
      this.$reset()
    },

    // 刷新token
    async refreshUserToken() {
      const { data } = await accountAPI.refreshToken({
        Id: this.userInfo.UserId!,
        Account: this.userInfo.Account,
        RefreshToken: this.userInfo.RefreshToken,
        HospitalCode: this.userInfo.HospitalCode,
        HospitalName: this.userInfo.HospitalName,
      })
      this.updateUserInfo({
        ...this.userInfo,
        ...data,
      })
    },
  },
})
