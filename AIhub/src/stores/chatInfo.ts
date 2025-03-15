import { ref } from 'vue'
import { defineStore } from 'pinia'

export const chatInfoStore = defineStore('chatInfoStore', () => {
  const inputBoxInfo = ref<string>('') //聊天框内容
  const isSendMessage = ref<boolean>(false) //是否发送消息
  const curretChatId = ref<number>() //当前的对话id
  const currentResponse = ref<string>('') //当前返回的消息

  return { inputBoxInfo, isSendMessage, curretChatId, currentResponse }
})
