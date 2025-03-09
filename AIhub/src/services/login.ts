// import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import request from '@/utils/request';
import type { RequsetUser, ResponseLogin } from '@/types/account'
import type{ AxiosError} from 'axios'

// import type { AxiosRequestConfig } from 'axios'

const message = useMessage()
const router = useRouter()


// if (!request) {
//   throw new Error('request 函数未被提供')
// }

// export const requestLogin = (dataAccount: RequsetUser): void => {
//   request<ResponseLogin>({
//     url: '/api/v1/login', // 根据业务调整请求的 URL
//     method: 'post', // 注意使用 method 而非 methods
//     data: dataAccount, // 传递实际的数据
//   })
//     .then((result) => {
//       console.log('登录信息:', result)
//       router.push('/chat')
//       message.success('登录成功')
//     })
//     .catch((error:AxiosError) => {
//       console.error(error)
//       message.error('登录失败，连接超时')
//     })
// }
