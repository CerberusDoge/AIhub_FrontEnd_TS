import request from '@/utils/request'
import type { RequsetUser, ResponseLogin } from '@/types/account'

export const requestLogin = async (dataAccount: RequsetUser): Promise<ResponseLogin> => {
  try {
    const result = await request<ResponseLogin>({
      url: '/api/v1/login',
      method: 'post',
      data: dataAccount,
    })

    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    localStorage.setItem('userId', JSON.stringify(result.id))
    localStorage.setItem('account', result.account)
    localStorage.setItem('isLoggedIn', 'islogged')

    return result.data
  } catch (error: any) {
    console.error(error)
    throw error
  }
}
