/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ChatRequest } from '@/types/message'
import { useChatInfoStore } from '@/stores/chatInfo'
import { useUserStore } from '@/stores/userInfo'
import { getUserInfo } from '@/services/user'
import { switchDataToServeMsg, switchDataToClientMsg } from './chat'

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

const userInfo = useUserStore()
export const fetchRequest = async (data: ChatRequest) => {
  fetch(`${baseURL}/api/v1/chat`, {
    method: 'post',
    headers: headers,
    body: JSON.stringify(data), // 请求体需序列化
  })
    .then(async (response) => {
      const info = data.message
      console.log(info)
      getUserInfo()
        .then(async () => {
          chatInfo.curretChatId = userInfo.userChatInfos[0].id

          console.log(chatInfo.inputBoxInfo)
          console.log(chatInfo.curretChatId)

          const reader = response!.body!.getReader()
          const decoder = new TextDecoder()
          chatInfo.currentResponse = ''
          chatInfo.currentReasonResponse = ''
          let partialData = '' // 存储未完整的消息

          console.log(response)
          let recordReasonPositon: number = -1 //记录推理在对话详细列表的位置
          let recordPositon: number = -1 //记录推理在对话详细列表的位置

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
                    console.log(parsedData)
                    chatInfo.currentReasonResponse += parsedData.data.replace('reason: ', '')

                    if (recordReasonPositon < 0) {
                      //如果是第一次遇到推理
                      chatInfo.allChats?.push(
                        switchDataToServeMsg(chatInfo.currentReasonResponse, true),
                      )

                      recordReasonPositon = chatInfo.allChats!.length! - 1
                    } else {
                      chatInfo.allChats![recordReasonPositon].reasoning_content =
                        chatInfo.currentReasonResponse
                    }
                  } else {
                    chatInfo.currentResponse += parsedData.data

                    if (recordPositon < 0) {
                      //如果是第一次遇到内容
                      chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentResponse, false))
                      recordPositon = chatInfo.allChats!.length! - 1
                    } else {
                      chatInfo.allChats![recordPositon].content = chatInfo.currentResponse
                    }
                  }
                } else {
                  console.log('end')
                }
              }
            })
          }

          // if (chatInfo.currentReasonResponse) {
          //   chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentReasonResponse, true))
          //   chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentResponse, false))
          // } else chatInfo.allChats?.push(switchDataToServeMsg(chatInfo.currentResponse, false))
        })
        .catch((error) => {
          console.error('Request failed!!:', error)
          throw error
        })
    })
    .catch((error) => {
      console.error('Request failed!!:', error)
      throw error
    })
}
