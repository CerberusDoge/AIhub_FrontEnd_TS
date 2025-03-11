export const fetchRequset = (url: string, data: any, storeData: any) => {
  const headers = new Headers()
  const authorization = localStorage.getItem('accessToken')
  headers.set('Authorization', `Bearer ${authorization}`)
  headers.append('Content-Type', 'application/json')
  fetch('http://45.207.208.42' + url, {
    method: 'POST',
    headers: headers,
    body: data, // 请求体需序列化
  })
    .then((response) => {
      storeData = response
      console.log(response)
    })
    .catch((error) => console.error('Request failed:', error))
}
