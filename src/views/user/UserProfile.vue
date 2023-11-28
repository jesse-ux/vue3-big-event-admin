<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user.js'
// 使用仓库中的数据 无需响应式
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()

const user = ref({
  id,
  username,
  nickname,
  email
})

const formRef = ref()

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]{3,10}$/,
      message: '用户名只能包含大写字母、小写字母、数字、中划线或下划线',
      trigger: 'blur'
    }
  ],
  nickname: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]{3,10}$/,
      message: '用户名只能包含大写字母、小写字母、数字、中划线或下划线',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_._%+-]+@[a-zA-Z0-9_.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确格式的邮箱',
      trigger: 'blur'
    }
  ]
})
const submitForm = async () => {
  // 提交前预校验 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(user.value)
  // 通知user模块， 进行数据更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单页 -->
    <el-form :model="user" label-width="120px" :rules="rules" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" disabled />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
