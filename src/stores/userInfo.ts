import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatInfo } from '@/types/message'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref<boolean>(false) //是否登录
  const account = ref<string>('') //账号
  const apiKey = ref<string>('') //apikey
  const userChatInfos = ref<ChatInfo[] | null>(null) //用户聊天记录
  const userStars = ref<ChatInfo[] | null>(null) //用户收藏
  return { isLoggedIn, account, apiKey, userChatInfos, userStars }
})
