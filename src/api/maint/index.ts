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
 * 根据用户名获取院区
 * @returns
 */
export function getHospitalByUserName(params: { userName: string }) {
  return request<UserHospitalDto[]>({
    url: `/maint/user/${params.userName}/hospital`,
    params,
  })
}

/**
 * 获取当前公钥
 * @returns
 */
export function getCurrentPublicKey() {
  return request<string>({
    url: `/maint/account/getCurrentPublicKey`,
  })
}

/**
 * 用户登录
 * @returns
 */
export function userLogin(data: UserLoginDto) {
  return request<UserTokenInfoDto>({
    url: `/maint/account`,
    method: 'post',
    data,
  })
}

/**
 * 获取个人信息
 * @returns
 */
export function getUserInfo() {
  return request<UserInfoDto>({
    url: `/maint/account`,
  })
}

/**
 * 获取本地配置文件
 * @returns
 */
export function getSettings() {
  return request<SettingsDto>({
    baseURL: '',
    url: 'settings.json',
  })
}

/**
 * 获取本地版本文件
 * @returns
 */
export function getVersionNote() {
  return request<VersionDto>({
    baseURL: '',
    url: 'version.json',
  })
}

/**
 * 根据院区和用户获取系统
 * @returns
 */
export function getSystemByHospitalCode(params: { hospitalCode: string }) {
  return request<UserLicenseSystemDto>({
    url: `/maint/user/${params.hospitalCode}/system`,
    params,
  })
}

/**
 * 根据某个系统下的菜单
 * @returns
 */
export function getMenuBysystemCode(params: { systemCode: string }) {
  return request<UserMenuNodeDto[]>({
    url: `/maint/user/${params.systemCode}/menu`,
    params,
  })
}

/**
 * 退出登录
 * @returns
 */
export function userLogoutApi() {
  return request({
    url: '/maint/account',
    method: 'delete',
  })
}

/**
 * 刷新token
 * @returns
 */
export function refreshToken(data: UserRefreshTokenDto) {
  return request<UserTokenInfoDto>({
    url: '/maint/account',
    method: 'put',
    data,
  })
}

/**
 * 修改登录密码
 * @returns
 */
export function changePassword(data: UserChangePwdDto) {
  return request({
    url: '/maint/account/password',
    method: 'put',
    data,
  })
}
