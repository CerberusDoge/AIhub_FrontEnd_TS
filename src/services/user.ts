import type { Response } from '@/types/message'
import { useUserStore } from '@/stores/userInfo'
import request from '@/utils/request'
import type { UpdateRequest } from '@/types/account'
import  {useChatInfoStore} from '@/stores/chatInfo'

const UserStore = useUserStore()
const ChatInfoStore=useChatInfoStore()

//获取用户信息
export const getUserInfo = async () => {
  try {
    const data = await request<Response>({ url: '/api/v2/user', method: 'get' })
    console.log(data)
    UserStore.account = data.account
    UserStore.apiKey = data.apiKey
    UserStore.userChatInfos = data.userChatMetas.slice().reverse()
    UserStore.userStars = data.userStars.slice().reverse()
    ChatInfoStore.curretChatId=UserStore.userChatInfos[0].id
    localStorage.setItem('account', data.account)
    localStorage.setItem('apiKey', data.apiKey)
    localStorage.setItem('isLoggedIn', 'islogged')
  } catch (error: any) {
    console.error(error)
  }
}

//更新用户信息
export const updateUserInfo = async (data: UpdateRequest) => {
  try {
    console.log(data)
    const response = await request<any>({
      url: '/api/v1/user',
      method: 'post',
      data: data
    })
    console.log(response)
  } catch (error: any) {
    console.error(error)
    throw error
  }
}
