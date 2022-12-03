// typings.d.ts or router.ts
// 提示
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 当前路由界面标题
    title: string

    // 图标，也是菜单图标
    icon?: string

    // 路由访问是否需要权限 每个路由都必须声明
    requiresAuth: boolean

    // 是否KeepAlive缓存
    keepAlive?: boolean

    // 可以访问的角色
    roles?: RoleEnum[]
  }

  // 设置路由类型 meta 必填
  type MyRouteRecordRaw = Omit<RouteRecordRaw, 'meta'> & {
    meta?: RouteMeta
  }
}
