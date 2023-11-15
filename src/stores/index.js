// pinia独立维护
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCounterStore } from './modules/counter'
// export { useCounterStore }
// 将所有仓库插件中的数据收集在此，按需导出
export * from './modules/counter'
export * from './modules/user'
