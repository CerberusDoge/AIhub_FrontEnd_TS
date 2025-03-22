import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
// 关键样式引入

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
  {
    // 合并其他配置到构造函数
    breaks: true,
    gfm: true,
  },
)

import type { Tokens } from 'marked' // 导入 Tokens 命名空间

function removeCodeBlockMarkers(str) {
  // 正则表达式匹配头尾标记并捕获代码内容
  const pattern = /^```\w+[\t ]*?\n?([\s\S]*?)\n?```$/gm

  return str.replace(pattern, '$1')
}

// 使用 Tokens.Code 作为类型
const renderer = new marked.Renderer()
renderer.code = function ({ raw, lang }: Tokens.Code) {
  const validLang = hljs.getLanguage(lang || '') ? lang : 'plaintext'

  // 高亮处理（保留生成的 HTML 标签）
  raw = removeCodeBlockMarkers(raw)
  const highlighted = hljs.highlight(raw, {
    language: validLang!,
  }).value

  return `
    <div class="code-block">
      <div class="lang-label">${validLang}</div>
      <pre><code class="hljs ${validLang}">${highlighted}</code></pre>
    </div>
  `
}

marked.setOptions({ renderer })
export const parseMarkdown = (content) => {
  const html = marked.parse(content)

  return html
}
