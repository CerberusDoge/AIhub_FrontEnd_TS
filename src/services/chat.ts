import request from '@/utils/request'
import type { deleteChat, ChatInfo, RequestStar, ContentDetail } from '@/types/message'
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

export const star = (chatInfoId: number) => {
  request<ChatInfo>({
    url: `/api/v1/star/${chatInfoId}`,
    method: 'post',
    data: { chatInfoId: chatInfoId },
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

//获得详细对话信息
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

//将数据转化为用户对话记录格式
export const switchDataToClientMsg = (content: string): ContentDetail => {
  return {
    content: content,
    role: 'user',
    reasoning_content: null,
    isNew: true,
  }
}
//将数据转化为服务端对话记录格式
export const switchDataToServeMsg = (content: string, reasoning: boolean): ContentDetail => {
  const msg: ContentDetail = {
    content: null,
    role: 'assistant',
    reasoning_content: null,
    isNew: true,
  }
  if (reasoning) msg.reasoning_content = content
  else msg.content = content
  return msg
}
