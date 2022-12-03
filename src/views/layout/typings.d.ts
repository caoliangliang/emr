import type { UserSystemDto } from '@/api/maint/types'

export type GetMenuType = (SystemMeunArr: [UserSystemDto, UserMenuNodeDto]) => void

export interface AsideMenuInstance {
  getMenu: GetMenuType
}
