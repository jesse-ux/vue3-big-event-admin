<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

const formRef = ref()
// 校验函数
const validatePasswordMatch = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}
const validateRePasswordMatch = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次密码不同'))
  } else {
    callback()
  }
}

// 密码校验规则
const rules = {
  old_pwd: [
    { required: true, message: '必须填写原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '原密码长度在6-15位之间', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' },
    { validator: validatePasswordMatch, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: validateRePasswordMatch,
      trigger: 'blur'
    }
  ]
}

const userStore = useUserStore()
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('修改密码成功')
  //   密码修改成功后，退出重新登录
  // 清除本地token和个人信息
  userStore.setToken('')
  userStore.setUser({})
  // 拦截登录
  router.push('/login')
}

const resetForm = () => {
  pwdForm.value = {
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
  }
  formRef.value.resetFields()
}
</script>
<template>
  <page-container title="重置密码">
    <!-- 密码表单 -->
    <el-form label-width="120px" :model="pwdForm" :rules="rules" ref="formRef">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style>
.el-input {
  --el-input-width: 300px;
}
</style>
