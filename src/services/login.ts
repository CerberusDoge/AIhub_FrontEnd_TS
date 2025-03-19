import type { RequsetUser } from '@/types/account'
import type { Response } from '@/types/message'
import request from '@/utils/request'

export const requestLogin = async (dataAccount: RequsetUser): Promise<Response> => {
  try {
    console.log(dataAccount)
    const result = await request<Response>({
      url: '/api/v2/login',
      method: 'post',
      data: dataAccount,
    })
    console.log(result)
    localStorage.setItem('id', JSON.stringify(result.id))
    localStorage.setItem('account', result.account)
    localStorage.setItem('apiKey', result.apiKey)
    localStorage.setItem('isLoggedIn', 'islogged')
    localStorage.setItem('satoken', result.token.tokenValue)
    return result.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
