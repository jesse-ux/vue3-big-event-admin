<script setup>
import { ref } from 'vue'
import { artAddChannelService, artEditChannelService } from '@/api/article.js'

const dialogVisible = ref(false)
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})

const formRef = ref()
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类名必须是1-15位的字母或数字',
      trigger: 'blur'
    }
  ]
}
const open = (row) => {
  console.log(row)
  dialogVisible.value = true //弹窗打开
  formModel.value = { ...row } //添加 -> 重置表单内容 编辑->存储了需要回显的数据
}

const emit = defineEmits(['success'])
// 修改或编辑后提交数据到服务器 因为要发出请求则需要异步操作async
const onSubmit = async () => {
  // 提交前需要预校验
  formRef.value.validate()
  // 判断是编辑还是添加 有id的是编辑 无id的是添加
  const isEdit = formModel.value.id
  if (isEdit) {
    // 编辑模式
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    // 添加模式
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
// 向外暴露方法
defineExpose({
  open
})
</script>

<!-- 组件对外暴露一个方法open 基于open传来的参数区分添加还是编辑操作 -->
<!-- open({}) 表单无需渲染 说明是添加 -->
<!-- open({id, cate_name})  表单需要渲染 说明是编辑-->
<!-- open 调用后可以打开弹窗 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑' : '添加'"
    width="30%"
  >
    <el-form
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
      ref="formRef"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input placeholder="请输入分类名称" v-model="formModel.cate_name">
        </el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
