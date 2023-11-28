<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/channelSelect.vue'
import ArticleEdit from './components/ArticleEdit.vue'
import { artGetListService } from '../../api/article'
import { formatTime } from '@/utils/format.js'
const articleList = ref([]) //文章列表
const total = ref(0) //总条数
const loading = ref(false) // loading状态
// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数变化了， 那么原本正在访问的当前页意义不大， 数据大概率不在那一页了
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页和每页条数进行渲染
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  params.value.pagenum = page
  // 基于最新的当前页进行渲染
  getArticleList()
}

// 搜索逻辑
const onSearch = () => {
  // 按照最新的条件，重新检索，从第一页开始展示
  params.value.pagenum = 1 //重置页面
  getArticleList() //渲染页面
}
// 重置逻辑
const onReset = () => {
  // 将筛选条件情况 重新检索 从第一页开始展示
  params.value.pagenum = 1 //重置页面
  params.value.cate_id = '' // 重置文章分类
  params.value.state = '' // 重置文章状态
  getArticleList()
}
// 绑定抽屉实例
const articleEditRef = ref()

// 添加逻辑
const onAddArticle = () => {
  // 调用抽屉实例暴露出来的方法 传递空对象说明是添加
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  // 调用抽屉组件暴露出来的方法 传递该行的参数 进行编辑
  // console.log(row)
  articleEditRef.value.open(row)
}
// 删除逻辑
const onDelArticle = (row) => {
  console.log(row)
}

// 添加或者编辑成功的回调
const onSuccess = (state) => {
  if (state === 'add') {
    // 如果是添加, 最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数 再渲染
    params.value.pagenum = lastPage
  }
  // 如果是编辑, 直接渲染当前页
  getArticleList()
}

// 定义请求参数对象
const params = ref({
  pagenum: 1, //当前1页
  pagesize: 5, //当前生效的每页条数
  cate_id: '',
  state: ''
})

// 基于params参数获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类:">
        <!--vue2 v-model 是:value 和 @input 的简写 -->
        <!-- vue3 v-model 是:modelValue 和 @update:modelValue 的简写  -->
        <!-- vue3 v-model:自定义属性 相当于与 :自定义属性 @update:自定义属性 -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态:">
        <!-- 这里value标记发布状态 通过中文标记 已发布/草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <!-- #default={row} 获取一整行的数据 v-for 遍历item-->
        <template #default="{ row }">
          <el-link :underline="false" type="primary">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name">
        <template #default="{ row }">
          <el-tag type="success">{{ row.cate_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

<style lang="scss"></style>
