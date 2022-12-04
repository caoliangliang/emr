// 配置文件
export interface SettingsDto {
  title?: string
  sessionTimeout?: number
  baseURL?: string
}

// 版本文件
export interface VersionDto {
  VersionNote?: string[]
}

// 用户登录表单
export interface UserLoginDto {
  Account: string
  Password: string
  HospitalCode: string
  HospitalName: string
}

// 用户院区数据
export interface UserHospitalDto {
  HospitalId: number
  HospitalName: string
  HospitalCode: string
}

// 登录token数据
export interface UserTokenInfoDto {
  Token: string
  RefreshToken: string
  Message: string
}

// 登录token数据
export interface UserRefreshTokenDto {
  Id: number
  Account: string
  RefreshToken: string
  HospitalCode: string
  HospitalName: string
}

// 个人信息
export interface UserProfileDto {
  UserId: number
  Account: string
  UserNo: string
  UserName: string
  UserPostionCode: string
  UserPostion: string
  UserTitleCode: string
  UserTitle: string
  ClinicalIdentity: number
  Email: string
  Phone: string
  Sex: number
  SexName: string
  Status: number
  StatusName: string
  Birthday: Date | string
  CertificateType: string
  CertificateNo: string
  Introduce: string
  ProvinceCode: string
  ProvinceName: string
  CityCode: string
  CityName: string
  AreaCode: string
  AreaName: string
  DetailedAddress: string
  CreateBy: number
  CreateTime: Date | string
  ModifyBy: number
  ModifyTime: Date | string
}

export type UserInfoDto = {
  UserId: number
  Profile: UserProfileDto
}

// 系统
export interface UserSystemDto {
  SystemId: number
  SystemName: string
  SystemCode: string
}

// 系统证书验证
export interface UserLicenseSystemDto {
  SystemList: UserSystemDto[]
  LicenseMessage: string
}

// 菜单节点数据
export interface UserMenuNodeDto {
  MenuId: number
  ParentId: number
  MenuName: string
  Levels: number
  IsMenu: boolean
  IsMenuName: string
  IsEnabled: number
  StatusName: string
  OrderNo: number
  Url: string
  Path: string
  Icon: string
  MenuCode: string
  PCode: string
  Component: string
  Hidden: boolean
  Children: UserMenuNodeDto[]
}

// 修改登录密码
export interface UserChangePwdDto {
  UserId: number
  OldPassword: string
  Password: string
  RePassword: string
}
