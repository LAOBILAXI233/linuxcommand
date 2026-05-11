import { marked } from 'marked';
import hljs from 'highlight.js';

marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {
        console.error('Highlight error:', e);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

export function renderMarkdown(content: string): string {
  if (!content) {
    return '';
  }
  
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('Markdown parse error:', error);
    return '<p>内容解析错误</p>';
  }
}
