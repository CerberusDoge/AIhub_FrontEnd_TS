/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChatRequest } from '@/types/message'
import { useChatInfoStore } from '@/stores/chatInfo'
import { getUserInfo } from '@/services/user'
import { switchDataToServeMsg } from './chat'

const headers = new Headers()
const authorization = localStorage.getItem('satoken')
headers.append('satoken', authorization!)
headers.append('Content-Type', 'application/json')
const baseURL = 'http://8.138.207.252:8080'

const chatInfo = useChatInfoStore()
function isJSON(jsonStr: any) {
  try {
    JSON.parse(jsonStr)
    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false
  }
}
export const fetchRequest = async (data: ChatRequest) => {
  console.log(data)
  fetch(`${baseURL}/api/v1/chat`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(data), // 请求体需序列化
  })
    .then(async (response) => {
      const reader = response!.body!.getReader()
      const decoder = new TextDecoder()
      chatInfo.currentResponse = ''
      chatInfo.currentReasonResponse = ''
      let partialData = '' // 存储未完整的消息

      console.log(response)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        partialData += decoder.decode(value, { stream: true })
        console.log(chatInfo.currentResponse)
        // 处理按行拆分的 SSE 数据
        const lines = partialData.split('\n')
        partialData = lines.pop() || '' // 可能有未完整的行，保留到下次解析

        lines.forEach((line) => {
          if (line.startsWith('data:')) {
            const jsonStr = line.replace(/^data:\s*/, '').trim()
            let parsedData
            if (isJSON(jsonStr)) parsedData = JSON.parse(jsonStr)
            if (parsedData?.type === 'metadata') {
              console.log(parsedData)
            } else if (parsedData?.type === 'message') {
              if (parsedData.data.startsWith('reason: ')) {
                chatInfo.currentReasonResponse += parsedData.data.replace('reason: ', '')
              } else {
                chatInfo.currentResponse += parsedData.data
              }
            } else {
              console.log('end')
            }
          }
        })
      }
      if (chatInfo.currentReasonResponse) {
        chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentReasonResponse, true))
        chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentResponse, false))
      } else chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentResponse, false))
      getUserInfo().then((res) => console.log(res))
    })
    .catch((error) => {
      console.error('Request failed!!:', error)
      throw error
    })
}
