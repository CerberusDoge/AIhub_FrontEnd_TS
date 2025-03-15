import type { Response } from '@/types/message'
import { useUserStore } from '@/stores/userInfo'
import request from '@/utils/request'
import { debounce } from './debounce'
import type { UpdateRequest } from '@/types/account'

const UserStore = useUserStore()

//获取用户信息
export const getUserInfo = async () => {
  try {
    const data = await request<Response>({ url: '/api/v2/user', method: 'get' })
    console.log(data)
    UserStore.account = data.account
    UserStore.apiKey = data.apiKey
    UserStore.userChatInfos = data.userChatInfos
    UserStore.userStars = data.userStars
    localStorage.setItem('account', data.account)
    localStorage.setItem('apiKey', data.apiKey)
    localStorage.setItem('isLoggedIn', 'islogged')
  } catch (error: any) {
    console.error(error)
  }
}

export const updateUserInfo = async (data: UpdateRequest) => {
  try {
    const response = await request<string>({
      url: '/api/v1/user',
      method: 'post',
      data: JSON.stringify(data)
    })
  } catch (error: any) {
    console.error(error)
  }
}
