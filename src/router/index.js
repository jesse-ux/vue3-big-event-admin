import { createRouter, createWebHistory } from 'vue-router'

// createRouter 创建路由实例
// 配置history模式 区别就是地址栏带不带#
// createWebHistory history模式 地址栏不带#
// createWebHashHistory hash模式 地址栏带#

// console.log(import.meta.env.DEV) 是否运行在开发环境
// vite 中的环境变量 import.meta.env.BASE_URL 就是vite.config.js 中的base配置项 基本URL
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
