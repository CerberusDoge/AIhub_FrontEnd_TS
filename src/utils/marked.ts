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
  // 更精确的正则表达式，匹配代码块并保留非代码块内容
  const pattern = /```(\w+)\s*\n([\s\S]*?)\n```/g

  // 使用replace方法，只替换代码块部分
  return str.replace(pattern, (_, lang, code) => {
    // 只处理代码块内容，保留其他文本
    return code.trim()
  })
}

// 使用 Tokens.Code 作为类型
const renderer = new marked.Renderer()
renderer.code = function ({ raw, lang }: Tokens.Code) {
  const validLang = hljs.getLanguage(lang || '') ? lang : 'plaintext'

  // 高亮处理（保留生成的 HTML 标签）
  const cleanCode = removeCodeBlockMarkers(raw)
  const highlighted = hljs.highlight(cleanCode, {
    language: validLang!,
  }).value

  return `
    <div class="code-block">
      <div class="code-header">
        <div class="lang-label">${validLang}</div>
        <button class="copy-button" onclick="copyCode(this)">
          <span class="copy-text">复制</span>
          <span class="copy-success" style="display: none;">已复制</span>
        </button>
      </div>
      <pre><code class="hljs ${validLang}">${highlighted}</code></pre>
    </div>
  `
}

marked.setOptions({ renderer })
export const parseMarkdown = (content) => {
  const html = marked.parse(content)

  return html
}
