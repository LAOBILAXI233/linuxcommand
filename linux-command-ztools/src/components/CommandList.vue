<template>
  <div class="command-list">
    <div class="list-header">
      <h2 class="list-title">
        <span v-if="searchKeyword">搜索结果: "{{ searchKeyword }}"</span>
        <span v-else>Linux 命令列表</span>
      </h2>
      <span class="command-count">共 {{ commands.length }} 个命令</span>
    </div>
    
    <div v-if="commands.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-text">未找到相关命令</p>
      <p class="empty-hint">请尝试其他关键词</p>
    </div>
    
    <div v-else class="commands-grid">
      <div
        v-for="item in commands"
        :key="item.name"
        class="command-card"
        @click="$emit('select-command', item.name)"
      >
        <div class="card-header">
          <code class="command-name">{{ item.name }}</code>
          <span v-if="item.score > 0" class="relevance-badge">
            {{ item.score }}% 匹配
          </span>
        </div>
        <div class="card-body">
          <p class="command-preview">{{ getPreview(item.name) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCommand } from '../data/commands'

defineProps<{
  commands: Array<{name: string, score: number}>
  searchKeyword: string
}>()

defineEmits<{
  (e: 'select-command', commandName: string): void
}>()

const previewCache = new Map<string, string>()

function getPreview(commandName: string): string {
  if (previewCache.has(commandName)) {
    return previewCache.get(commandName)!
  }
  
  const command = getCommand(commandName)
  const preview = command ? command.description : '点击查看详情...'
  
  previewCache.set(commandName, preview)
  return preview
}
</script>

<style scoped>
.command-list {
  max-width: 1200px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e1e8ed;
}

.list-title {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.command-count {
  font-size: 14px;
  color: #7f8c8d;
  background: #ecf0f1;
  padding: 6px 12px;
  border-radius: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #7f8c8d;
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: #95a5a6;
  margin: 0;
}

.commands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.command-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
}

.command-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.command-name {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
  background: #f0f3ff;
  padding: 4px 10px;
  border-radius: 5px;
}

.relevance-badge {
  font-size: 12px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.card-body {
  margin-top: 8px;
}

.command-preview {
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
