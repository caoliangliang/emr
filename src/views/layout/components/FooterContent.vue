<template>
  <span class="copyright">Copyright (C) 2017 北京嘉和美康信息技术有限公司</span>
  <span class="versions-info">
    <span class="version-number">当前版本号：{{ version }}</span>
    <span class="version-update">
      <IEpBell  style="margin-right: 3px;"/>
      版本更新内容
    </span>
  </span>
</template>

<script lang="ts" setup>
import { version } from '../../../../package.json'
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
