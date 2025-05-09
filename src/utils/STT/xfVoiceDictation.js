import CryptoJS from 'crypto-js'
import { storeToRefs } from 'pinia'
import { useChatInfoStore } from '@/stores/chatInfo'

const ChatInfoStore = useChatInfoStore()
const { isSST } = storeToRefs(ChatInfoStore)

// import Worker from './transcode.worker.js?worker'
export default class IatRecorder {
  constructor(opts = {}) {
    // 服务接口认证信息(语音听写（流式版）WebAPI)
    this.APPID = opts.APPID || ''
    this.APISecret = opts.APISecret || ''
    this.APIKey = opts.APIKey || ''

    // webSocket请求地址
    this.url = opts.url || 'wss://iat-api.xfyun.cn/v2/iat'
    this.host = opts.host || 'iat-api.xfyun.cn'

    // 识别监听方法
    this.onTextChange = opts.onTextChange || Function()
    this.onWillStatusChange = opts.onWillStatusChange || Function()

    // 方言/语种
    this.status = 'null'
    this.language = opts.language || 'zh_cn'
    this.accent = opts.accent || 'mandarin'

    // 流媒体
    this.streamRef = []
    // 记录音频数据
    this.audioData = []
    // 记录听写结果
    this.resultText = ''
    // wpgs下的听写结果需要中间状态辅助记录
    this.resultTextTemp = ''
    // 音频数据多线程
    this.init()
  }

  // 获取webSocket请求地址鉴权
  getWebSocketUrl() {
    return new Promise((resolve, reject) => {
      const { url, host, APISecret, APIKey } = this
      // 请求地址根据语种不同变化
      try {
        let date = new Date().toGMTString(),
          algorithm = 'hmac-sha256',
          headers = 'host date request-line',
          signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`,
          signatureSha = CryptoJS.HmacSHA256(signatureOrigin, APISecret),
          signature = CryptoJS.enc.Base64.stringify(signatureSha),
          authorizationOrigin = `api_key="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`,
          authorization = btoa(authorizationOrigin)
        resolve(`${url}?authorization=${authorization}&date=${date}&host=${host}`)
      } catch (error) {
        let date = new Date().toGMTString(),
          algorithm = 'hmac-sha256',
          headers = 'host date request-line',
          signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`,
          signatureSha = CryptoJS.HmacSHA256(signatureOrigin, APISecret),
          signature = CryptoJS.enc.Base64.stringify(signatureSha),
          authorizationOrigin = `api_key="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`,
          authorization = btoa(authorizationOrigin)
        resolve(`${url}?authorization=${authorization}&date=${date}&host=${host}`)
      }
    })
  }

  // 操作初始化
  init() {
    try {
      if (!this.APPID || !this.APIKey || !this.APISecret) {
        alert('请正确配置【迅飞语音听写（流式版）WebAPI】服务接口认证信息！')
      } else {
        // 使用更安全的方式创建 Worker
        const workerUrl = new URL('./transcode.worker.js', import.meta.url)
        this.webWorker = new Worker(workerUrl, { type: 'module' })
        this.webWorker.onmessage = (event) => {
          this.audioData.push(...event.data)
        }
      }
    } catch (error) {
      console.error('Worker 初始化失败:', error)
      alert('对不起：请在服务器环境下运行！')
    }
  }
  // 修改录音听写状态
  setStatus(status) {
    this.onWillStatusChange &&
      this.status !== status &&
      this.onWillStatusChange(this.status, status)
    this.status = status
  }
  // 设置识别结果内容
  setResultText({ resultText, resultTextTemp } = {}) {
    console.log(resultText, resultTextTemp)
    this.onTextChange && this.onTextChange(resultTextTemp || resultText || '')
    resultText !== undefined && (this.resultText = resultText)
    resultTextTemp !== undefined && (this.resultTextTemp = resultTextTemp)
  }
  // 修改听写参数
  setParams({ language, accent } = {}) {
    language && (this.language = language)
    accent && (this.accent = accent)
  }
  // 对处理后的音频数据进行base64编码，
  toBase64(buffer) {
    let binary = ''
    let bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
  // 连接WebSocket
  connectWebSocket() {
    return this.getWebSocketUrl().then((url) => {
      let iatWS
      if ('WebSocket' in window) {
        iatWS = new WebSocket(url)
      } else if ('MozWebSocket' in window) {
        iatWS = new MozWebSocket(url)
      } else {
        alert('浏览器不支持WebSocket!')
        return false
      }
      this.webSocket = iatWS
      this.setStatus('init')
      iatWS.onopen = (e) => {
        this.setStatus('ing')
        // 重新开始录音
        setTimeout(() => {
          this.webSocketSend()
        }, 500)
      }
      iatWS.onmessage = (e) => {
        this.webSocketRes(e.data)
      }
      iatWS.onerror = (e) => {
        this.recorderStop(e)
      }
      iatWS.onclose = (e) => {
        this.recorderStop(e)
      }
    })
  }
  // 初始化浏览器录音
  recorderInit() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }

      if (!this.audioContext) {
        alert('浏览器不支持webAudioApi相关接口')
        return false
      }

      // 获取麦克风权限
      return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.streamRef = stream

          // 创建音频源
          this.mediaSource = this.audioContext.createMediaStreamSource(stream)

          // 尝试使用 AudioWorklet
          if (this.audioContext.audioWorklet) {
            const audioProcessorUrl = new URL('./audio-processor.js', import.meta.url)
            return this.audioContext.audioWorklet.addModule(audioProcessorUrl)
              .then(() => {
                this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'audio-processor')
                this.audioWorkletNode.port.onmessage = (event) => {
                  this.webWorker.postMessage(event.data)
                }
                this.mediaSource.connect(this.audioWorkletNode)
                this.audioWorkletNode.connect(this.audioContext.destination)
              })
              .catch(error => {
                console.warn('AudioWorklet 初始化失败，使用 ScriptProcessor 降级方案:', error)
                this.fallbackToScriptProcessor()
              })
          } else {
            this.fallbackToScriptProcessor()
          }
        })
        .then(() => {
          this.connectWebSocket()
        })
        .catch(error => {
          console.error('音频初始化失败:', error)
          alert('无法获取麦克风权限或初始化音频处理失败')
          return false
        })
    } catch (error) {
      console.error('音频上下文初始化失败:', error)
      alert('浏览器不支持webAudioApi相关接口')
      return false
    }
  }

  fallbackToScriptProcessor() {
    try {
      this.scriptProcessor = this.audioContext.createScriptProcessor(0, 1, 1)
      this.scriptProcessor.onaudioprocess = (e) => {
        if (this.status === 'ing') {
          try {
            this.webWorker.postMessage(e.inputBuffer.getChannelData(0))
          } catch (error) {
            console.error('音频数据处理失败:', error)
          }
        }
      }
      this.mediaSource.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)
    } catch (error) {
      console.error('ScriptProcessor 初始化失败:', error)
      alert('浏览器不支持音频处理功能')
    }
  }

  // 向webSocket发送数据(音频二进制数据经过Base64处理)
  webSocketSend() {
    if (this.webSocket.readyState !== 1) return false
    // 音频数据
    const audioData = this.audioData.splice(0, 1280)
    const params = {
      common: {
        app_id: this.APPID,
      },
      business: {
        language: this.language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
        domain: 'iat',
        accent: this.accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
        vad_eos: 5000,
        dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
      },
      data: {
        status: 0,
        format: 'audio/L16;rate=16000',
        encoding: 'raw',
        audio: this.toBase64(audioData),
      },
    }
    // 发送数据
    this.webSocket.send(JSON.stringify(params))
    this.handlerInterval = setInterval(() => {
      // websocket未连接
      if (this.webSocket.readyState !== 1) {
        this.audioData = []
        clearInterval(this.handlerInterval)
        return false
      }
      if (this.audioData.length === 0) {
        if (this.status === 'end') {
          this.webSocket.send(
            JSON.stringify({
              data: {
                status: 2,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: '',
              },
            }),
          )
          this.audioData = []
          clearInterval(this.handlerInterval)
        }
        return false
      }
      // 中间帧
      this.webSocket.send(
        JSON.stringify({
          data: {
            status: 1,
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: this.toBase64(this.audioData.splice(0, 1280)),
          },
        }),
      )
    }, 40)
  }
  // 识别结束 webSocket返回数据
  webSocketRes(resultData) {
    let jsonData = JSON.parse(resultData)
    console.log('data:' + jsonData)
    if (jsonData.data && jsonData.data.result) {
      let data = jsonData.data.result
      let str = ''
      let ws = data.ws
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs) {
        if (data.pgs === 'apd') {
          // 将resultTextTemp同步给resultText
          this.setResultText({
            resultText: this.resultTextTemp,
          })
        }
        // 将结果存储在resultTextTemp中
        this.setResultText({
          resultTextTemp: this.resultText + str,
        })
      } else {
        this.setResultText({
          resultText: this.resultText + str,
        })
      }
    }
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.webSocket.close()
    }
    if (jsonData.code !== 0) {
      this.webSocket.close()
    }
  }
  // 启动录音
  recorderStart() {
    if (!this.audioContext) {
      this.recorderInit()
    } else {
      this.audioContext.resume()
      this.connectWebSocket()
    }
  }
  // 停止录音
  recorderStop() {
    if (!(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgen))) {
      // safari下suspend后再次resume录音内容将是空白，设置safari下不做suspend
      this.audioContext && this.audioContext.suspend()
    }
    this.setStatus('end')
    try {
      // this.streamRef.getTracks().map(track => track.stop()) || his.streamRef.getAudioTracks()[0].stop();
    } catch (error) {
      console.error('暂停失败!')
    }
  }
  // 开始
  start() {
    this.recorderStart()
    this.setResultText({ resultText: '', resultTextTemp: '' })
  }
  // 停止
  stop() {
    isSST.value = false
    this.recorderStop()

    if (this.webSocket && this.webSocket.readyState === 1) {
      this.webSocket.close()
    }

    // 安全地停止音频轨道
    if (this.streamRef && this.streamRef.getTracks) {
      this.streamRef.getTracks().forEach(track => {
        try {
          track.stop()
        } catch (error) {
          console.error('停止音频轨道失败:', error)
        }
      })
      this.streamRef = null
    }

    // 安全地断开音频节点连接
    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect()
      this.audioWorkletNode = null
    }
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor.onaudioprocess = null
      this.scriptProcessor = null
    }
    if (this.mediaSource) {
      this.mediaSource.disconnect()
      this.mediaSource = null
    }

    // 安全地关闭音频上下文
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
        .then(() => {
          this.audioContext = null
        })
        .catch(error => {
          console.error('关闭音频上下文失败:', error)
        })
    }
  }
}
