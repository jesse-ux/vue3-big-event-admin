<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'
// 基于store的数据 初始化imgUrl的初始值
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
// 不实时上传  本地预览
const onSelectFile = (uploadFile) => {
  //   imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 基于FileReader 读取图片预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  //   把读取到的图片转换成base64格式
  reader.onload = () => {
    imgUrl.value = reader.result
    // console.log(imgUrl.value)
  }
}

// 提交头像
const onUpdateAvatar = async () => {
  // 上传图片
  await userUpdateAvatarService(imgUrl.value)
  // userStore 重新渲染
  await userStore.getUser()
  // 成功提示消息
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="更换头像" :show-file-list="false">
    <el-upload
      :on-change="onSelectFile"
      :auto-upload="false"
      class="avatar-uploader"
      ref="uploadRef"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br />
    <el-button
      @click="uploadRef.$el.querySelector('input').click()"
      type="primary"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    <el-button
      type="success"
      :icon="Upload"
      size="large"
      @click="onUpdateAvatar"
      >上传图片</el-button
    >
  </page-container>
</template>

<style scoped lang="scss">
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color--primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
