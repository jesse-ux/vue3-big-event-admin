import { defineStore } from 'pinia'
import { ref } from 'vue'

//计数器模块
export const useCounterStore = defineStore('big-count', () => {
  const count = ref(100)
  const add = (n) => {
    count.value += n
  }
  return {
    count,
    add
  }
})
