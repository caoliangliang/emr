<template>
  <section class="header-system">
    <!-- 当前系统 -->
    <div class="current-system">{{ currentSystem.SystemName }}</div>
    <!-- 更多 -->
    <div class="system-more">
      <el-space class="system-more-space">
        更多
        <IEpCaretBottom style="margin-right: -8px" />
      </el-space>
      <!-- 下拉菜单 -->
      <nav class="system-menu">
        <el-space wrap :size="20">
          <div
            class="system-menu-item"
            v-for="system in userStore.systemList.SystemList"
            :key="system.SystemId"
          >
            <span
              @click="changeSystemFn(system)"
              :class="{
                active: system.SystemId === currentSystem.SystemId,
              }"
            >
              <IEpMenu style="margin-right: 5px" />
              {{ system.SystemName }}
            </span>
          </div>
        </el-space>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UserSystemDto } from '@/api/maint/types'
import { useUserStore } from '@/stores/user'
import { useCurrentSystem,useGetFirstMenus } from '@/hooks'
const userStore = useUserStore()
const emits = defineEmits(['changeMenu'])

const currentSystem = ref<UserSystemDto>({} as UserSystemDto)

// 挂载之前
onMounted(async () => {
  // 获取系统菜单
  if (userStore.systemList.SystemList.length > 0) {
    const [system, menu] = useCurrentSystem()
    currentSystem.value = system
    emits('changeMenu', [currentSystem.value, menu])
  }
})

// 切换系统
const changeSystemFn = (system: UserSystemDto) => {
  const menu = useGetFirstMenus(userStore.systemMenuObj[system.SystemCode][0])
  currentSystem.value = system
  emits('changeMenu', [currentSystem.value, menu])
}
</script>

<style lang="scss" scoped>
.header-system {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  .current-system {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100px;
    height: 100%;
    margin: 0 10px;
    font-size: 18px;
    font-weight: 400;
    color: #fff;

    &::after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 4px;
      content: '';
      width: 100%;
      height: 6px;
      background-color: #00b293;
      border-radius: 3px;
    }
  }

  .system-more {
    position: relative;

    width: 100px;
    height: 100%;
    color: #fff;
    font-size: 16px;

    .system-more-space {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: default;
    }

    &:hover {
      background-color: #2a83bf;
      box-shadow: 0px 6px 6px 2px rgb(0 0 0 / 12%);
      .system-menu {
        display: block;
      }
    }
  }

  .system-menu {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    padding: 30px 50px;
    width: 850px;
    min-height: 100px;
    background-color: #2a83bf;
    border-radius: 0 0 6px 6px;
    box-shadow: 0px 6px 6px 2px rgb(0 0 0 / 12%);

    .el-space {
      .system-menu-item {
        width: 130px;
        height: 30px;

        > span {
          display: inline-block;
          position: relative;
          display: inline-flex;
          height: 100%;
          cursor: pointer;
        }
        .active {
          &::after {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height: 2px;
            background-color: #00b293;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
