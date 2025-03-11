import { ref } from 'vue'
import { defineStore } from 'pinia'

export const chatInfoStore = defineStore('chatInfoStore', () => {
  const inputBoxInfo = ref<string>('')

  return { inputBoxInfo }
})
