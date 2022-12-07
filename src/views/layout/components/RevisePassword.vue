<template>
  <div class="change-pwd-form">
    <el-form
      ref="pwdFormRef"
      :model="pwdForm"
      :rules="Pwdrules"
      label-width="100px"
    >
      <el-form-item label="旧密码：" prop="OldPassword">
        <el-input
          v-model="pwdForm.OldPassword"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请输入旧密码"
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item label="新密码：" prop="Password">
        <el-input
          v-model="pwdForm.Password"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请输入新密码"
          :prefix-icon="Lock"
          @input="pwdStrengthFn"
        />
      </el-form-item>
      <el-form-item label="密码强度：">
        <el-progress
          :percentage="custom.percentage"
          text-inside
          :stroke-width="18"
          :color="custom.color"
          :format="progressFormat"
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="RePassword">
        <el-input
          v-model="pwdForm.RePassword"
          type="password"
          autocomplete="off"
          show-password
          placeholder="请再次输入密码"
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="debouncedSubmitPwdFormFn(pwdFormRef)"
          :disabled="disabledSubmitPwd"
          >确认修改</el-button
        >
        <el-button @click="resetPwdForm(pwdFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { UserChangePwdDto } from '@/api/maint/types'
import { useUserStore } from '@/stores/user'
import { accountAPI } from '@/api/maint'
import { useValidate, useGetPwdPublicKey } from '@/hooks'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import {
  regexPwd,
  pwdRegex1,
  pwdRegex2,
  pwdRegex3,
  pwdRegex4,
} from '@/utils/validate'
import { useDebounceFn } from '@vueuse/core'

const pwdFormRef = ref<FormInstance>()

// 密码验证
const validatePass = (rule: any, value: any, callback: any) => {
  if (!regexPwd.test(value)) {
    callback(new Error('必须包含大写字母、小写字母、数字、特殊字符!'))
  }
  callback()
}
// 再次输入密码验证
const validateSubPass = (rule: any, value: any, callback: any) => {
  if (value !== pwdForm.Password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
// 表单验证规则
const Pwdrules = reactive<FormRules>({
  OldPassword: [{ required: true, message: '请填写旧密码', trigger: 'blur' }],
  Password: [
    { required: true, message: '请填写新密码', trigger: 'blur' },
    { min: 8, max: 30, message: '密码长度在8-30位', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  RePassword: [
    { required: true, message: '请填写确认密码', trigger: 'blur' },
    { min: 8, max: 30, message: '密码长度在8-30位', trigger: 'blur' },
    { validator: validateSubPass, trigger: 'blur' },
  ],
})

const userStore = useUserStore()
// 获取id方法
const getUserInfoProfile = async () => {
  const { data } = await accountAPI.getUserInfo()
  userStore.updateProfile(data.Profile)
}
// 没有用户id
if (!userStore.userInfo.UserId) {
  // 获取个人信息
  getUserInfoProfile()
}
// 密码表单
const pwdForm = reactive<UserChangePwdDto>({
  UserId: userStore.userInfo.UserId!,
  OldPassword: '',
  Password: '',
  RePassword: '',
})
// 密码强度进度条
const pwdStrength = ref(-1)
const custom = ref({
  color: '#f56c6c',
  percentage: 0,
})
const customColors = [
  { color: '#f56c6c', percentage: 0 },
  { color: '#f56c6c', percentage: 33 },
  { color: '#e6a23c', percentage: 66 },
  { color: '#5cb87a', percentage: 100 },
]
const progressFormat = (percentage: number) => {
  let txt = ''
  switch (percentage) {
    case 33:
      txt = '弱'
      break
    case 66:
      txt = '中'
      break
    case 100:
      txt = '强'
      break
  }
  return txt
}
const pwdStrengthFn = (value: string) => {
  pwdStrength.value = -1
  if (value !== '') pwdStrength.value++
  if (pwdRegex1.test(value)) pwdStrength.value++
  if (pwdRegex2.test(value)) pwdStrength.value++
  if (pwdRegex3.test(value)) pwdStrength.value++
  if (pwdRegex4.test(value)) pwdStrength.value++
}
watch(pwdStrength, (newValue) => {
  if (newValue === -1) custom.value = customColors[0]
  if (newValue === 0 || newValue === 1) custom.value = customColors[1]
  if (newValue === 1 || newValue === 2 || newValue === 3)
    custom.value = customColors[2]
  if (newValue === 4) custom.value = customColors[3]
})
const disabledSubmitPwd = ref(false)
// 重制密码
const resetPwdForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

//  确认修改密码
const submitPwdForm = async (formEl: FormInstance | undefined) => {
  if (!(await useValidate(formEl))) return
  disabledSubmitPwd.value = true

  try {
    const newPwdForm = await useGetPwdPublicKey(pwdForm)
    await accountAPI.changePassword(newPwdForm)
    userStore.userLogout()
    ElMessage({
      message: '密码修改成功，请重新登录',
      type: 'success',
      duration: 6000,
    })
    disabledSubmitPwd.value = false
  } catch (error) {
    disabledSubmitPwd.value = false
  }
}
const debouncedSubmitPwdFormFn = useDebounceFn(submitPwdForm, 400)
</script>

<style lang="scss" scoped>
.change-pwd-form {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .el-form {
    width: 400px;
  }

  .el-progress {
    width: 100%;
  }
}
</style>
