<script setup>
// 在 Vue3 CompositionAPI 中
// 获取路由对象router useRouter()
// const router = useRouter()
// 获取路由参数 route useRoute()
// const route = useRoute()
import { useRoute, useRouter } from 'vue-router'
import { useUserStore, useCounterStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const goList = () => {
  console.log(route, router)
  router.push('/list')
}

const userStore = useUserStore()
const counterStore = useCounterStore()
</script>

<template>
  <div>
    我是App
    <el-button @click="$router.push('/home')">跳首页</el-button>
    <el-button @click="goList">跳列表页</el-button>
    <test-demo></test-demo>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>

    <hr />

    <p>{{ userStore.token }}</p>
    <el-button @click="userStore.setToken('asdbsxdwa')">登录</el-button>
    <el-button @click="userStore.removeToken()">退出</el-button>
    {{ counterStore.count }}
    <el-button @click="counterStore.add(2)">加法</el-button>
  </div>
</template>

<style></style>
