<template>
  <div class="login-timeout">
    <el-drawer
      v-model="drawer"
      direction="ttb"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :with-header="false"
      :modal="false"
      size="100%"
      destroy-on-close
      @closed="closedFn"
    >
      <el-container>
        <div class="logo-form-date">
          <span class="date-hour">{{ nowHour }}</span>
          <span class="date-minute">{{ nowMinute }}</span>
        </div>
        <div class="logo-form-ref">
          <el-form
            ref="logoFormRef"
            :model="logoForm"
            :rules="logoFormRules"
            @submit.prevent
          >
            <el-form-item prop="Password">
              <div class="user-name">
                <el-avatar :size="70">
                  {{ userStore.profile.UserName }}
                </el-avatar>
                <h5>您的登录会话已过期，请重新进入系统</h5>
              </div>
              <el-input
                key="loginTimeout"
                v-model="logoForm.Password"
                type="password"
                placeholder="请输入用户密码"
                show-password
                :prefix-icon="Lock"
                @keyup.enter="debouncedLoginFn(logoFormRef)"
              />
              <div class="sub-btn">
                <span @click="logoOutFn">返回登录</span>
                <span @click="debouncedLoginFn(logoFormRef)">进入系统</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="logo-form-time">
          <div class="time-date">
            <span>
              {{ nowHour + ':' + nowMinute }}
            </span>
            <span style="font-size: 30px; margin-left: 10px">{{ nowA }}</span>
          </div>
          <div class="time-day">
            {{ nowDate + ' ' + nowDay }}
          </div>
        </div>
      </el-container>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useTimestamp, useDebounceFn } from '@vueuse/core'
import dayjs from 'dayjs'

import type { UserLoginDto, UserTokenInfoDto } from '@/api/maint/types'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { userLogin } from '@/api/maint'
import { useValidate, useGetPublicKey } from '@/hooks'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.updateUserInfo({
  ...userStore.userInfo,
  Message: '会话过期',
})
const emits = defineEmits(['change', 'update:modelValue', 'closed'])
// props
const prop = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const drawer = computed({
  get() {
    return prop.modelValue
  },
  set(val) {
    emits('update:modelValue', false)
  },
})

// 获取当前时间
const now = useTimestamp()
const nowHour = computed(() => dayjs(now.value).format('HH'))
const nowMinute = computed(() => dayjs(now.value).format('mm'))
const nowA = computed(() => dayjs(now.value).format('A'))
const nowDate = computed(() => dayjs(now.value).format('YYYY-MM-DD'))
const nowDay = computed(() => {
  const num = dayjs(now.value).day()
  let txt = ''
  switch (num) {
    case 0:
      txt = '星期天'
      break
    case 1:
      txt = '星期一'
      break
    case 2:
      txt = '星期二'
      break
    case 3:
      txt = '星期三'
      break
    case 4:
      txt = '星期四'
      break
    case 5:
      txt = '星期五'
      break
    case 6:
      txt = '星期六'
      break
  }
  return txt
})

// 返回登录
const logoOutFn = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '返回登录中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  await userStore.userLogout()
  loading.close()
}

// 登录表单
const logoForm = reactive<UserLoginDto>({
  Account: userStore.userInfo.Account,
  Password: '',
  HospitalCode: userStore.userInfo.HospitalCode,
  HospitalName: userStore.userInfo.HospitalName,
})

// 表单验证
const logoFormRules = reactive<FormRules>({
  Password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const logoFormRef = ref<FormInstance>()

// 用户登录
const login = async (logoFormRef: FormInstance | undefined) => {
  // 表单验证
  if (!(await useValidate(logoFormRef))) return

  const pwd = await useGetPublicKey(logoForm.Password)
  // 登录
  const { data } = await userLogin({ ...logoForm, Password: pwd })
  // 登录和token数据存储到 pinia
  const { Password, ...logoFormRest } = logoForm
  const userInfo = {
    ...logoFormRest,
    ...data,
  }
  userStore.updateUserInfo(userInfo as UserLoginDto & UserTokenInfoDto)
  emits('change')
  drawer.value = false
}
// 防抖
const debouncedLoginFn = useDebounceFn(login, 400)
// 关闭动画结束
const closedFn = () => {
  emits('closed')
}
</script>

<style lang="scss" scoped>
.login-timeout {
  :deep(.el-drawer) {
    .el-drawer__body {
      padding: 0;
    }
  }
  .el-container {
    position: relative;
    align-items: center;
    height: 100%;
    background: #000;

    .logo-form-date {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 100%;
      height: 80%;

      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 100%;
        font-size: 300px;
        color: #bababa;
        font-weight: 900;
        background-color: #141313;
      }
    }

    .logo-form-time {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #d1d5db;
      .time-date {
        font-size: 48px;
      }
      .time-day {
        font-size: 24px;
      }
    }
    .logo-form-ref {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(6px);
      color: #fff;
    }

    .el-form {
      width: 300px;

      .user-name {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        font-size: 16px;
        margin-bottom: 5px;

        .el-avatar {
          background-color: #78c3b6;
        }
        & > h5 {
          font-weight: 400;
          font-size: 16px;
        }
      }
      .sub-btn {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        color: #0960bd;

        span {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
