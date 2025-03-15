import type { RequsetUser, ResponseLogin } from '@/types/account'
import type { Response } from '@/types/message'
import { requestWithoutCredit } from '@/utils/request'

export const requestLogin = async (dataAccount: RequsetUser): Promise<Response> => {
  try {
    const result = await requestWithoutCredit<ResponseLogin>({
      url: '/api/v1/login',
      method: 'post',
      data: dataAccount,
    })

    localStorage.setItem('id', JSON.stringify(result.id))
    localStorage.setItem('account', result.account)
    localStorage.setItem('apiKey', result.apiKey)
    localStorage.setItem('account', result.account)

    return result.data
  } catch (error: any) {
    console.error(error)
    throw error
  }
}
