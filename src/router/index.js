import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

// createRouter 创建路由实例
// 配置history模式 区别就是地址栏带不带#
// createWebHistory history模式 地址栏不带#
// createWebHashHistory hash模式 地址栏带#

// console.log(import.meta.env.DEV) 是否运行在开发环境
// vite 中的环境变量 import.meta.env.BASE_URL 就是vite.config.js 中的base配置项 基本URL
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // route路由规则配置
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 添加登录访问拦截 => 默认直接放行
// to 即将进入的目标 from 当前导航即将离开的路由
// 根据返回值决定，是放行还是拦截
// 返回值：
//  undefined/true 直接放行
//  false 拦回from的地址
//  具体路径 或 路径对象 拦截到对应的地址
//  '/login'   {name:'login'}
router.beforeEach((to) => {
  // 如果没有token，且访问的是非登录页，拦截到登录页，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
  return true
})

export default router
