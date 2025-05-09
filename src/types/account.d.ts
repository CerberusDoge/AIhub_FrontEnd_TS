/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequsetUser = {
  account: string | null
  password: string | null
  [property: string]: any
}

export type UpdateRequest = {
  /**
   * 新的apikey
   */
  apiKey?: string | null
  /**
   * 新的密码
   */
  password?: string
  [property: string]: any
}
