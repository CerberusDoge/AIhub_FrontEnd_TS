import request from '@/utils/request'
import type { deleteChat, ChatInfo, RequestStar } from '@/types/message'
import { error } from 'naive-ui/es/_utils/naive/warn'
import { useChatInfoStore } from '@/stores/chatInfo'
import { getUserInfo } from '@/services/user'

const ChatInfo = useChatInfoStore()

export const delChat = (id: number) => {
  request<deleteChat>({ url: `/api/v1/chat/${id}`, method: 'DELETE' })
    .then((response) => {
      getUserInfo()
      console.log(response)
    })
    .catch((error) => {
      console.error(error)
      throw error
    })
}

export const star = (chatInfoId: number, userId: number) => {
  request<ChatInfo>({
    url: '/api/v1/star',
    method: 'post',
    data: { chatInfoId: chatInfoId, userId: userId },
  })
  .then((response) => {
    getUserInfo()
    console.log(response)
  })
  .catch((error) => {
    console.error(error)
    throw error
  })

}

export const unStar = (chatInfoId: number, userId: number) => {
  request<ChatInfo>({
    url: '/api/v1/star',
    method: 'delete',
    data: { chatInfoId: chatInfoId, userId: userId },
  })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
      throw error
    })

}

export const getChatInfo = async (id: number) => {
  try {
    const data = await request<ChatInfo>({
      url: `/api/v1/chat/${id}`,
      method: 'get',
    })
    ChatInfo.currentChatInfo = data
  } catch (error) {
    console.error(error)
    throw error
  }
}
