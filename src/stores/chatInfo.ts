import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatInfo } from '@/types/message'
import type { ContentDetail } from '@/types/message'

export const useChatInfoStore = defineStore('chatInfoStore', () => {
  const inputBoxInfo = ref<string>('') //聊天框内容
  const isReasoned = ref<boolean>(false) //推理是否渲染完成
  const curretChatId = ref<number>() //当前的对话id
  const currentChatInfo = ref<ChatInfo>({ content: '', id: undefined }) //当前选择对话所有信息
  const currentResponse = ref<string>('') //当前返回的消息
  const currentReasonResponse = ref<string>('') //当前返回的推理消息
  const allChats = ref<ContentDetail[]>() //当前//存储当前id所有对话信息

  return {
    inputBoxInfo,
    isReasoned,
    curretChatId,
    currentResponse,
    currentReasonResponse,
    currentChatInfo,
    allChats,
  }
})
