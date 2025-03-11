/**
 * 用户聊天请求
 */
export type ChatRequest = {
  /**
   * 新对话，是否是新对话
   */
  chatInfoId: number | null
  /**
   * 消息
   */
  message: string
  /**
   * 模型名称，deepseek-r1, doubao-1.5pro
   */
  model: string
  /**
   * 提示词，用于预定义角色，比如你是一只猫娘
   */
  prompt?: string
  /**
   * 会话id，null 表示新会话
   */
  userId: number
  [property: string]: any
}
export type deleteChat = {
  message: string
  [property: string]: any
}

/**
 * 列表
 */
export type Menu = {
  account: string
  id: number
  password: string
  userChatInfos: ChatInfo[]
  userStars: ChatInfo[]
  [property: string]: any
}

/**
 * ChatInfo
 */
export type ChatInfo = {
  /**
   * 聊天内容，json数组
   */
  content: string
  /**
   * ID 编号
   */
  id: number
  /**
   * 模型，deepseek-r1, doubao-1.5pro
   */
  model: string
  topic: string
  userId: number
  [property: string]: any
}

export type RequestStar ={
  chatInfoId: number;
  userId: number;
  [property: string]: any;
}
