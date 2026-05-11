<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        placeholder="搜索 Linux 命令（如 ls、cd、grep）..."
        @input="onInput"
        @keydown.enter="onEnter"
      />
      <button 
        v-if="keyword" 
        class="clear-btn"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
    
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-list">
      <div
        v-for="item in suggestions"
        :key="item.name"
        class="suggestion-item"
        @click="selectCommand(item.name)"
      >
        <span class="command-name">{{ item.name }}</span>
        <span class="match-score" v-if="item.score > 0">{{ item.score }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { searchAndSort } from '../utils/search'

const emit = defineEmits<{
  (e: 'search', keyword: string): void
  (e: 'select-command', commandName: string): void
}>()

const keyword = ref('')
const showSuggestions = ref(false)
const allCommands = ref<string[]>([])
const suggestions = computed(() => {
  if (!keyword.value.trim()) {
    return []
  }
  return searchAndSort(keyword.value, allCommands.value)
})

watch(keyword, (newVal) => {
  showSuggestions.value = newVal.length >= 2
})

function loadCommands() {
  if (window.linuxCommandAPI) {
    allCommands.value = window.linuxCommandAPI.getCommandList()
  }
}

loadCommands()

function onInput() {
  emit('search', keyword.value)
}

function onEnter() {
  if (suggestions.value.length > 0) {
    selectCommand(suggestions.value[0].name)
  }
}

function selectCommand(commandName: string) {
  showSuggestions.value = false
  emit('select-command', commandName)
}

function clearSearch() {
  keyword.value = ''
  showSuggestions.value = false
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  position: relative;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: 18px;
  margin-right: 10px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 0 4px;
}

.clear-btn:hover {
  color: #333;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 20px;
  right: 20px;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

.command-name {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.match-score {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}
</style>
