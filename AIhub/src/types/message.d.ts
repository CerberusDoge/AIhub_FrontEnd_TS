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
  model: Model
  /**
   * 提示词，用于预定义角色，比如你是一只猫娘
   */
  prompt?: string
  [property: string]: any
}

export type deleteChat = {
  message: string
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

export type RequestStar = {
  chatInfoId: number
  userId: number
  [property: string]: any
}

/**
 * UserResponse
 */
export type Response = {
  /**
   * 用户账号
   */
  account: string
  /**
   * 用户的apikey
   */
  apiKey: string
  /**
   * 用户id
   */
  id: number
  token: Token
  /**
   * 用户的聊天记录
   */
  userChatMetas: ChatInfo[]
  /**
   * 用户的收藏
   */
  userStars: ChatInfo[]
  [property: string]: any
}

/**
 * ChatInfo
 */
export type ChatInfo = {
  /**
   * 聊天信息id，ID 编号
   */
  id: number
  /**
   * 模型，deepseek-r1, doubao-1.5pro 这是枚举
   */
  model: Model
  /**
   * 聊天主题
   */
  topic: string
  /**
   * 所属用户id
   */
  userId: number
  [property: string]: any
}

/**
 * 模型，deepseek-r1, doubao-1.5pro 这是枚举
 */
export enum Model {
  DeepseekR1 = 'deepseek-r1',
  Doubao15Pro = 'doubao-1.5pro',
}
