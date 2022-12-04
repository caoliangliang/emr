<template>
  <el-container>
    <!-- 顶部 -->
    <el-header class="layout-header">
      <section class="header-logo-menu">
        <!-- logo -->
        <section class="header-logo">
          <el-image class="logo" :src="logoUrl" />
        </section>
        <!-- 系统菜单 -->
        <SystemMenu @change-menu="changeMenuFn" />
      </section>
      <!-- 个人 -->
      <section class="header-info">
        <el-dropdown :hide-on-click="false" @command="commandFn">
          <span class="header-info-dropdown">
            <el-space>
              <IEpUserFilled size="20" />
              {{ userStore.profile.UserName }}
              <IEpCaretBottom />
            </el-space>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="log-out" link @click="logoutFn">退出</el-button>
        <el-dialog
          v-model="rePwdVisible"
          title="修改密码"
          width="450"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          destroy-on-close
        >
          <RevisePassword />
        </el-dialog>
      </section>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside class="aside-menu">
        <AsideMenu ref="asideMenuRef" />
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
    <!-- 底部 -->
    <el-footer class="layout-footer">
      <FooterContent />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import type { UserSystemDto, UserMenuNodeDto } from '@/api/maint/types'
import type { AsideMenuInstance } from './typings'
import logoUrl from '@/assets/images/logo.png'
import SystemMenu from './components/SystemMenu.vue'
import AsideMenu from './components/AsideMenu.vue'
import FooterContent from './components/FooterContent.vue'
import RevisePassword from './components/RevisePassword.vue'
import { getUserInfo } from '@/api/maint'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

// 页面挂载之前
onBeforeMount(() => {
  // 获取个人信息
  getUserInfoProfile()
})

// 获取个人信息
const getUserInfoProfile = async () => {
  const { data } = await getUserInfo()
  userStore.updateProfile(data.Profile)
}
// 侧边栏ref
const asideMenuRef = ref<AsideMenuInstance | null>(null)
// 获取菜单
const changeMenuFn = (SystemMeunArr: [UserSystemDto, UserMenuNodeDto]) => {
  if (asideMenuRef.value) asideMenuRef.value.getMenu(SystemMeunArr)
}

// 退出登录
const logoutFn = () => {
  userStore.userLogout()
}

// 修改密码
const rePwdVisible = ref(false)
const commandFn = (command: string) => {
  switch (command) {
    case '修改密码':
      rePwdVisible.value = true
      break
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #156aa3;

  .header-logo-menu {
    flex: 1;
    display: flex;
    height: 100%;
    .header-logo {
      display: flex;
      align-items: center;
      padding: 0 10px;
      margin-right: 20px;
      width: 219px;
      height: 100%;
      background: url('@/assets/images/nav_bg.png') no-repeat;

      .logo {
        :deep(img) {
          filter: brightness(0) invert(1);
        }
      }
    }
  }

  .header-info {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
    color: #fff;

    .header-info-dropdown {
      display: flex;
      align-items: center;
      color: #fff;
    }

    .log-out {
      color: #fff;
    }
  }
}
.aside-menu {
  width: 200px;
  background-color: #156aa3;
  color: #fff;
}
.layout-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  background-color: #d4d3d3;
  color: #4d4d4d;
  font-size: 12px;
}
</style>
