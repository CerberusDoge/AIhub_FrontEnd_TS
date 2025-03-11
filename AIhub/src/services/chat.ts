import request from '@/utils/request'
import type { deleteChat, ChatInfo, Menu, RequestStar } from '@/types/message'
import { error } from 'naive-ui/es/_utils/naive/warn'

export const delChat = (id: number) => {
  request<deleteChat>({ url: `/api/v1/chat/${id}`, method: 'DELETE' }).then((response) => {
    console.log(response)
  })
}

export const star = (chatInfoId: number, userId: number) => {
  request<ChatInfo>({
    url: '/api/v1/star',
    method: 'post',
    data: { chatInfoId: chatInfoId, userId: userId },
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
    })
}
