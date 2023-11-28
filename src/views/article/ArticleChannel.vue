<script setup>
import { onMounted, ref } from 'vue'
import { artGetChannelsService, artDelChannelService } from '../../api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import channelEdit from '@/views/article/components/channelEdit.vue'
const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data

  loading.value = false
}
onMounted(() => {
  getChannelList()
})
console.log(channelList.value)
// 删除列表项
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
// 修改列表项
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 添加列表项
const onAddChannel = () => {
  dialog.value.open({})
}

// 添加或编辑成功后刷新列表项
const onSuccess = () => {
  getChannelList()
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" plain @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table
      v-loading="loading"
      :data="channelList"
      style="width: 100%"
      stripe
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称">
        <template #default="{ row }">
          <el-tag>{{ row.cate_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- row 是channelList的一项， $index是下标 -->
        <template #default="{ row, $index }">
          <el-button
            @click="onEditChannel(row, $index)"
            type="primary"
            :icon="Edit"
            circle
            plain
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="onDelChannel(row, $index)"
          />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss"></style>
