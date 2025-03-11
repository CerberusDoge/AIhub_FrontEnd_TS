import axios from 'axios'
import type { responseRefresh } from '@/types/account'

const reToken = localStorage.getItem('refreshToken')

export const refreshToken = async () => {
  try {
    const refreshToken: responseRefresh = await axios({
      url: 'http://45.207.208.42/api/v1/refresh',
      method: 'post',
      data: { refreshToken: reToken },
    })
    console.log('刷新token成功!')
    localStorage.setItem('accessToken', refreshToken.data.newAccessToken)
    console.log(refreshToken.data.newAccessToken)
  } catch (error) {
    console.log(error)
  }
}
