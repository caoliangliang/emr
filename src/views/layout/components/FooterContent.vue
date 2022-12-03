<template>
  <span class="copyright">Copyright (C) 2017 北京嘉和美康信息技术有限公司</span>
  <span class="versions-info">
    <span class="version-number">当前版本号：{{ version }}</span>
    <el-popover
      placement="top-start"
      title="版本更新内容"
      trigger="click"
      width="200"
    >
      <template #reference>
        <span class="version-update" @click="getVersionUpdateFn">
          <IEpBell style="margin-right: 3px" />
          版本更新内容
        </span>
      </template>
      <p v-for="(content, i) in userStore.version.VersionNote" :key="i">
        {{ i + 1 + '：' + content }}
      </p>
    </el-popover>
  </span>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { version } from '../../../../package.json'
const userStore = useUserStore()

// 获取版本文件
const getVersionUpdateFn = () => {
  userStore.getVersion()
}
</script>

<style lang="scss" scoped>
.copyright {
  flex: 1;
  text-align: center;
}
.versions-info {
  display: flex;
  width: 210px;
  .version-number {
    margin-right: 20px;
  }
  .version-update {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
</style>
