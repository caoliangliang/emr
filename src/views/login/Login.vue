<template>
  <el-container>
    <!-- 内容区域 -->
    <el-main>
      <!-- 登录表单 -->
      <el-form ref="logoFormRef" :model="logoForm" :rules="logoFormRules">
        <el-form-item>
          <h2 class="title">欢迎登录</h2>
        </el-form-item>
        <el-form-item prop="Account">
          <el-input
            v-model="logoForm.Account"
            placeholder="请输入用户名"
            :prefix-icon="User"
            @blur="getHospitalListFn"
          />
        </el-form-item>
        <el-form-item prop="Password">
          <el-input
            v-model="logoForm.Password"
            type="password"
            placeholder="请输入密码"
            show-password
            :prefix-icon="Lock"
            @keyup.enter="login(logoFormRef)"
          />
        </el-form-item>
        <el-form-item prop="HospitalCode">
          <el-select
            v-model="logoForm.HospitalCode"
            placeholder="请选择院区"
            @change="changeHospitalFn"
          >
            <el-option
              v-for="item in hospitalList"
              :key="item.HospitalId"
              :label="item.HospitalName"
              :value="item.HospitalCode"
            />
            <template #prefix>
              <el-icon :size="14"><House /> </el-icon>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            round
            @click="login(logoFormRef)"
            :disabled="disabledLogin"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
    <!-- 底部 -->
    <el-footer>
      <!-- logo -->
      <el-image class="logo" :src="logoUrl" />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import type {
  UserLoginDto,
  UserHospitalDto,
  UserTokenInfoDto,
} from '@/api/maint/types'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, House } from '@element-plus/icons-vue'
import logoUrl from '@/assets/images/logo.png'
import {
  getHospitalByUserName,
  getCurrentPublicKey,
  userLogin,
} from '@/api/maint'
import { JSEncrypt } from 'jsencrypt'
import { useValidate } from '@/hooks'
import { useUserStore } from '@/stores/user'

// 获取路由
const router = useRouter()

// 登录表单
const logoForm = reactive<UserLoginDto>({
  Account: '',
  Password: '',
  HospitalCode: '',
  HospitalName: '',
})
const logoFormRef = ref<FormInstance>()

// 表单验证
const logoFormRules = reactive<FormRules>({
  Account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  Password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  HospitalCode: [{ required: true, message: '请选择院区', trigger: 'change' }],
})

// 院区列表
const hospitalList = ref<UserHospitalDto[]>([])

// 获取院区
const getHospitalListFn = async () => {
  if (logoForm.Account === '') return
  const { data } = await getHospitalByUserName({ userName: logoForm.Account })
  hospitalList.value = data
  if (data.length > 0) {
    logoForm.HospitalCode = data[0].HospitalCode
    logoForm.HospitalName = data[0].HospitalName
  }
}
// 切换院区
const changeHospitalFn = (code: string) => {
  const cur = hospitalList.value.find((item) => item.HospitalCode === code)
  if (cur) logoForm.HospitalName = cur.HospitalName
}

// 获取公钥
const getPublicKey = async (pwd: string) => {
  const { data } = await getCurrentPublicKey()
  let jse = new JSEncrypt()
  jse.setPublicKey(data)
  let newPwd = jse.encrypt(pwd) as string // 进行加密
  return newPwd
}
const disabledLogin = ref(false)
// 用户登录
const login = async (logoFormRef: FormInstance | undefined) => {
  // 表单验证
  if (!(await useValidate(logoFormRef))) return
  disabledLogin.value = true
  try {
    const pwdLengthFlag = logoForm.Password.length < 8
    logoForm.Password = await getPublicKey(logoForm.Password)
    // 登录
    const { data } = await userLogin(logoForm)

    // 登录和token数据存储到 pinia
    const { Password, ...logoFormRest } = logoForm
    const userInfo = {
      ...logoFormRest,
      ...data,
    }
    const userStore = useUserStore()
    userStore.updateUserInfo(userInfo as UserLoginDto & UserTokenInfoDto)

    // 处理密码过去问题
    if (data.Message === '密码过期') {
      ElMessage({
        message: '密码已过期，请修改',
        type: 'warning',
        center: true,
      })
      // 跳转修改密码页面
      router.replace('/revisePassword')
    } else {
      // 密码小于8位提示
      if (pwdLengthFlag)
        ElMessage({
          message: '密码长度不足8位，请尽快修改',
          type: 'warning',
          center: true,
        })
      // 跳转主页
      router.push('/')
    }
    disabledLogin.value = false
  } catch (error) {
    disabledLogin.value = false
  }
}
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

    .el-form {
      width: 250px;
      .title {
        font-size: 33px;
        font-weight: 700;
        display: block;
        text-align: center;
        color: #499fce;
      }

      .el-form-item {
        :deep(.el-form-item__content) {
          justify-content: center;
        }

        .el-select {
          width: 100%;
        }
        .el-button {
          width: 90%;
          height: 38px;
        }
      }
    }
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
