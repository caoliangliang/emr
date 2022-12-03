<template>
  <el-menu
    unique-opened
    :default-active="String(curMenus.MenuId)"
    style="border-right: 0"
    @select="selectMenuFn"
  >
    <!-- 1级菜单 -->
    <template v-for="menu in menuList">
      <!-- 多级 -->
      <el-sub-menu
        :key="menu.MenuId"
        v-if="menu.Children.length > 0"
        :index="String(menu.MenuId)"
      >
        <template #title>
          <span>{{ menu.MenuName }}</span>
        </template>
        <!-- 2级菜单 -->
        <template v-for="menu2 in menu.Children">
          <!-- 多级 -->
          <el-sub-menu
            :key="menu2.MenuId"
            v-if="menu2.Children.length > 0"
            :index="String(menu2.MenuId)"
          >
            <template #title>
              <span>{{ menu2.MenuName }}</span>
            </template>
            <!-- 3级菜单 -->
            <el-menu-item
              v-for="children in menu2.Children"
              :key="children.MenuId"
              :index="String(children.MenuId)"
            >
              {{ children.MenuName }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 单级 -->
          <el-menu-item
            :key="menu2.MenuId + 'else'"
            v-else
            :index="String(menu2.MenuId)"
          >
            {{ menu2.MenuName }}
          </el-menu-item>
        </template>
      </el-sub-menu>
      <!-- 单级 -->
      <el-menu-item
        :key="menu.MenuId + 'else'"
        v-else
        :index="String(menu.MenuId)"
      >
        <template #title>
          <span>{{ menu.MenuName }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import type { GetMenuType } from '../typings'
import type { UserMenuNodeDto } from '@/api/maint/types'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
// 菜单列表
const menuList = ref<UserMenuNodeDto[]>([])
// 当前菜单
const curMenus = ref<UserMenuNodeDto>({} as UserMenuNodeDto)
// 获取菜单列表数据
const getMenu: GetMenuType = (SystemMeunArr) => {
  menuList.value = userStore.systemMenuObj[SystemMeunArr[0].SystemCode]
  curMenus.value = SystemMeunArr[1]

  // 跳转菜单路由
  gotoRouter(curMenus.value)
}

// 菜单激活
const selectMenuFn = (index: string) => {
  const menu = userStore.menuList.find((item) => String(item.MenuId) === index)!
  // 跳转菜单路由
  gotoRouter(menu)
}

// 跳转路由
const gotoRouter = (menu: UserMenuNodeDto) => {
  const isExist = router.hasRoute(menu.Component)
  if (isExist && !router.currentRoute.value.path.includes(menu.Component)) {
    router.push(menu.Component)
  }
}

// 导出获取菜单数据
defineExpose({ getMenu })
</script>

<style lang="scss" scoped>
.el-menu {
  --el-menu-bg-color: #156aa3;
  --el-menu-text-color: #fff;
  --el-menu-hover-bg-color: #105684;
  --el-menu-active-color: #fff;

  .el-menu-item {
    &.is-active {
      background-color: #00b293;
    }
  }
}
</style>
