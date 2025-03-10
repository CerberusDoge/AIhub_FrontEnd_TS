export type RequsetUser= {
  account: string|null;
  password: string|null;
  [property: string]: any;
}

export type ResponseRegister= {
  account: string;
  id: number;
  password: string;
  userChatInfos: string[];
  [property: string]: any;
}


export type ResponseLogin= {
  /**
     * 认证token，用于认证
     */
  accessToken: string;
  /**
   * 账号
   */
  account: string;
  /**
   * ID 编号
   */
  id: number;
  /**
   * 密码
   */
  password: string;
  /**
   * 刷新token，用于刷新认证token
   */
  refreshToken: string;
  /**
   * 用户聊天记录
   */
  userChatInfos: string[];
  [property: string]: any;
}

