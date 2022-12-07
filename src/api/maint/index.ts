import request from '@/utils/request'
import type {
  UserHospitalDto,
  UserLoginDto,
  UserTokenInfoDto,
  UserInfoDto,
  SettingsDto,
  UserLicenseSystemDto,
  UserMenuNodeDto,
  UserRefreshTokenDto,
  VersionDto,
  UserChangePwdDto,
} from './types'

/**
 * 登录相关API
 */
export const accountAPI = {
  /**
   * 获取当前公钥
   * @returns
   */
  getCurrentPublicKey() {
    return request<string>({
      url: `/maint/account/getCurrentPublicKey`,
    })
  },

  /**
   * 用户登录
   * @returns
   */
  userLogin(data: UserLoginDto) {
    return request<UserTokenInfoDto>({
      url: `/maint/account`,
      method: 'post',
      data,
    })
  },

  /**
   * 获取个人信息
   * @returns
   */
  getUserInfo() {
    return request<UserInfoDto>({
      url: `/maint/account`,
    })
  },

  /**
   * 退出登录
   * @returns
   */
  userLogoutApi() {
    return request({
      url: '/maint/account',
      method: 'delete',
    })
  },

  /**
   * 刷新token
   * @returns
   */
  refreshToken(data: UserRefreshTokenDto) {
    return request<UserTokenInfoDto>({
      url: '/maint/account',
      method: 'put',
      data,
    })
  },

  /**
   * 修改登录密码
   * @returns
   */
  changePassword(data: UserChangePwdDto) {
    return request({
      url: '/maint/account/password',
      method: 'put',
      data,
    })
  },
}

/**
 * 用户相关API
 */
export const userAPI = {
  /**
   * 根据用户名获取院区
   * @returns
   */
  getHospitalByUserName(params: { userName: string }) {
    return request<UserHospitalDto[]>({
      url: `/maint/user/${params.userName}/hospital`,
      params,
    })
  },

  /**
   * 根据院区和用户获取系统
   * @returns
   */
  getSystemByHospitalCode(params: { hospitalCode: string }) {
    return request<UserLicenseSystemDto>({
      url: `/maint/user/${params.hospitalCode}/system`,
      params,
    })
  },

  /**
   * 根据某个系统下的菜单
   * @returns
   */
  getMenuBysystemCode(params: { systemCode: string }) {
    return request<UserMenuNodeDto[]>({
      url: `/maint/user/${params.systemCode}/menu`,
      params,
    })
  },
}

/**
 * 本地文件相关API
 */
export const localAPI = {
  /**
   * 获取本地配置文件
   * @returns
   */
  getSettings() {
    return request<SettingsDto>({
      baseURL: '',
      url: 'settings.json',
    })
  },

  /**
   * 获取本地版本文件
   * @returns
   */
  getVersionNote() {
    return request<VersionDto>({
      baseURL: '',
      url: 'version.json',
    })
  },
}
