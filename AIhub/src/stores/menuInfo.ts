import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('useMenuStore', () => {
  const isDisplay = ref(true) //侧栏是否展示

  return { isDisplay }
})
