<script setup>
import { nextTick, ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article.js'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉的显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  title: '', //标题
  cate_id: '', //分类数据
  cover_img: '', //封面图片
  content: '', // string内容
  state: '' //状态类型
}

// 提供数据
const formModel = ref({
  title: '', //标题
  cate_id: '', //分类数据
  cover_img: '', //封面图片
  content: '', // string内容
  state: '' //状态类型
})
// 图片上传相关
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  console.log(uploadFile.raw)
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //预览图片
  // 立刻将图片对象,存入 formModel.value.cover_img 用于提交
  formModel.value.cover_img = uploadFile.raw
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态,存入 formModel
  formModel.value.state = state
  //   当前接口,需要的是formData对象
  // 将对象转换成=>formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    // 需要显示之前修改的内容
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 创建操作 不需要显示之前的内容
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知父组件添加成功 并重新渲染页面
    emit('success', 'add')
  }
}

// 获取富文本编辑器内容
const editorRef = ref()

// 对外暴露方法，基于传递来的参数，区分是添加文章还是编辑文章
// open({id, ..., ...}) => 表单需要渲染，说明是编辑
// open调用后，可以打开弹窗
const open = async (row) => {
  visibleDrawer.value = true // 显示抽屉
  //   console.log('抽屉接收到的参数是', row)
  if (row.id) {
    // 基于row.id发送请求，获取编辑对应的详情参数，进行回显
    const res = await artGetDetailService(row.id)
    console.log(res.data)
    formModel.value = res.data.data
    // 图片需要单独处理
    imgUrl.value = baseURL + formModel.value.cover_img
    // 图片提交给后台需要的格式是file对象格式
    // 需要将网络图片地址=> 转换成 file对象 存储起来 将来便于提交
    const file = await convertImageUrlToFile(
      imgUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    // 重置表单数据, 但是图片和富文本编辑器没有重置内容
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
  }
}

//  将网络图片地址转换为File 对象的函数
async function convertImageUrlToFile(imgUrl, filename) {
  try {
    const response = await axios.get(imgUrl, {
      responseType: 'arraybuffer' // 设置响应类型为 arraybuffer
    })

    // 将 arraybuffer 转换为 Blob 对象
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    // 创建 File 对象
    const file = new File([blob], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Failed to convert image URL to File:', error)
    return null
  }
}

defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.cate_id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单  model表单数据对象 -->
    <el-form :model="formModel" label-width="100px" ref="formRef">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          style="width: 100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 
            此处需要关闭 element-plus的自动上传 不需要配置action等参数 
            只需要本地预览图片即可,无需在提交前上传图片
            语法: URL.createObjectURL(...) 创建本地预览的地址, 来预览
        -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
            ref="editorRef"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
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
