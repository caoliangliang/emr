import type { UserMenuNodeDto } from '@/api/maint/types'

/**
 * 菜单转扁平数据
 */
export const menuListFlat = (menuList: UserMenuNodeDto[]) => {
  // 数据存放
  let list: UserMenuNodeDto[] = []
  for (let index = 0; index < menuList.length; index++) {
    list.push({ ...menuList[index], Children: [] })
    const arr =
      menuList[index].Children && menuListFlat(menuList[index].Children)
    list = list.concat(arr)
  }
  return list.filter((item) => {
    return item.Component !== null && item.Component !== ''
  })
}
