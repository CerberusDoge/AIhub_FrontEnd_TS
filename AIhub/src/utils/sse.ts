export const fetchRequest = (url: string, data: any, storeData: any) => {
  const headers = new Headers()
  const authorization = localStorage.getItem('accessToken')
  headers.set('Authorization', `Bearer ${authorization}`)
  headers.append('Content-Type', 'application/json')
  fetch('http://45.207.208.42' + url, {
    method: 'POST',
    headers: headers,
    body: data, // 请求体需序列化
  })
    .then(async (response) => {
      const reader = response!.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        storeData += decoder.decode(value, { stream: true })

        // 处理按行拆分的 SSE 数据
        const lines = storeData.split('\n')
        storeData = lines.pop() || '' // 可能有未完整的行，保留到下次解析
      }
    })
    .catch((error) => console.error('Request failed:', error))
}

// const reader = response!.body!.getReader()
// const decoder = new TextDecoder()
// let storeData = '' // 存储未完整的消息

// while (true) {
//   const { done, value } = await reader.read()
//   if (done) break

//   storeData += decoder.decode(value, { stream: true })

//   // 处理按行拆分的 SSE 数据
//   const lines = storeData.split('\n')
//   storeData = lines.pop() || '' // 可能有未完整的行，保留到下次解析

//   lines.forEach((line) => {
//     if (line.startsWith('data:')) {
//       const jsonStr = line.replace(/^data:\s*/, '').trim()
//       let parsedData
//       if (isJSON(jsonStr)) parsedData = JSON.parse(jsonStr)
//       if (parsedData?.type === 'metadata') {
//         console.log(parsedData)
//       } else if (parsedData?.type === 'message') {
//         if (parsedData.data.startsWith('reason: ')) {
//           reasonContainer.value!.innerText += parsedData.data.replace('reason: ', '')
//         } else {
//           assistantContainer.value!.innerText += parsedData.data
//         }
//       } else {
//         console.log('end')
//       }
//     }
//   })
// }
