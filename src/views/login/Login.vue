<template>
  <el-container>
    <!-- 内容区域 -->
    <el-main>
      <LoginForm />
    </el-main>
    <!-- 底部 -->
    <el-footer>
      <!-- logo -->
      <el-image class="logo" :src="logoUrl" />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo.png'
import LoginForm from './components/LoginForm.vue'
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-main {
    display: flex;
    justify-content: center;
    align-items: center;

    background: url('@/assets/images/pic.jpg');
    background-repeat: no-repeat;
    background-size: 160%;
    background-position: center left 49.5%;
  }
  .el-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;

    .logo {
      height: 48px;
    }
  }
}
</style>
