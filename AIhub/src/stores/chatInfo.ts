import { ref } from 'vue'
import { defineStore } from 'pinia'

export const chatInfoStore = defineStore('chatInfoStore', () => {
  const inputBoxInfo = ref<string>('') //聊天框内容
  const isSendMessage = ref<boolean>(false) //是否发送消息


  return { inputBoxInfo, isSendMessage}
})
