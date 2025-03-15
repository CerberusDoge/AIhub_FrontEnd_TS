import type { ChatRequest } from '@/types/message'

const headers = new Headers()
const authorization = localStorage.getItem('satoken')
headers.append('satoken', authorization!)
headers.append('Content-Type', 'application/json')
const baseURL = 'http://45.207.208.42'

export const fetchRequest = (data: ChatRequest, storeData: any) => {
  fetch(`${baseURL}/api/v1/chat`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(data), // 请求体需序列化
  })
    .then(async (response) => {
      const reader = response!.body!.getReader()
      const decoder = new TextDecoder()

      console.log("啊实打实大苏打")
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        storeData += decoder.decode(value, { stream: true })
        // const { done, value } = await reader.read()
        // if (done) break

        // storeData += decoder.decode(value, { stream: true })

        // // 处理按行拆分的 SSE 数据
        // const lines = storeData.split('\n')
        // storeData = lines.pop() || '' // 可能有未完整的行，保留到下次解析
      }
    })
    .catch((error) => console.error('Request failed:', error))
}
