/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="vite/client" />
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
import { marked } from 'marked'

declare module 'marked' {
  interface MarkedOptions {
    highlight?: (code: string, lang: string) => string
    langPrefix?: string
    // 其他需要扩展的选项...
  }
}
