<template>
  <div class="command-detail">
    <div class="detail-header">
      <button class="back-btn" @click="$emit('back')">
        ← 返回列表
      </button>
      <h1 class="command-title">
        <code>{{ command.name }}</code>
      </h1>
    </div>
    
    <div class="detail-content">
      <div 
        class="markdown-body" 
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'
import type { Command } from '../data/types'

const props = defineProps<{
  command: Command
}>()

defineEmits<{
  (e: 'back'): void
}>()

const renderedContent = computed(() => {
  return renderMarkdown(props.command.content)
})
</script>

<style scoped>
.command-detail {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 30px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 12px;
  transition: background 0.3s;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.command-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.command-title code {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 36px;
  color: white;
  backdrop-filter: blur(10px);
}

.detail-content {
  padding: 30px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.8;
  color: #333;
  font-size: 15px;
}

.markdown-body :deep(h1) {
  font-size: 28px;
  color: #2c3e50;
  border-bottom: 3px solid #667eea;
  padding-bottom: 12px;
  margin: 30px 0 20px 0;
}

.markdown-body :deep(h2) {
  font-size: 22px;
  color: #34495e;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
  margin: 25px 0 16px 0;
}

.markdown-body :deep(h3) {
  font-size: 18px;
  color: #2c3e50;
  margin: 20px 0 12px 0;
}

.markdown-body :deep(p) {
  margin: 12px 0;
  line-height: 1.8;
}

.markdown-body :deep(code) {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #e74c3c;
}

.markdown-body :deep(pre) {
  background: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 14px;
  line-height: 1.6;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 20px;
  margin: 16px 0;
  color: #7f8c8d;
  background: #f8f9fa;
  padding: 12px 20px;
  border-radius: 0 8px 8px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 30px;
  margin: 12px 0;
}

.markdown-body :deep(li) {
  margin: 6px 0;
  line-height: 1.6;
}

.markdown-body :deep(strong) {
  color: #2c3e50;
  font-weight: 600;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.markdown-body :deep(tr:nth-child(even)) {
  background: #f8f9fa;
}

.markdown-body :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(to right, #667eea, #764ba2);
  margin: 30px 0;
}
</style>
