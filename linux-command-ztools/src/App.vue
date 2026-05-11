<template>
  <div class="app-container">
    <SearchBar 
      @search="handleSearch" 
      @select-command="handleSelectCommand"
    />
    
    <div class="content-wrapper">
      <CommandList
        v-if="!selectedCommand"
        :commands="filteredCommands"
        :search-keyword="searchKeyword"
        @select-command="handleSelectCommand"
      />
      
      <CommandDetail
        v-else
        :command="selectedCommand"
        @back="handleBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import CommandList from './components/CommandList.vue'
import CommandDetail from './components/CommandDetail.vue'
import { getCommandList, getCommand } from './data/commands'
import type { Command } from './data/types'

const searchKeyword = ref('')
const selectedCommand = ref<Command | null>(null)
const filteredCommands = ref<Array<{name: string, score: number}>>([])

onMounted(() => {
  loadCommands()
})

function loadCommands() {
  const commands = getCommandList()
  filteredCommands.value = commands.slice(0, 30).map(name => ({ name, score: 0 }))
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
  
  if (!keyword.trim()) {
    loadCommands()
    return
  }
  
  const allCommands = getCommandList().map(c => c.name)
  const { searchAndSort } = require('./utils/search')
  filteredCommands.value = searchAndSort(keyword, allCommands)
}

async function handleSelectCommand(commandName: string) {
  const command = getCommand(commandName)
  if (command) {
    selectedCommand.value = command
  }
}

function handleBack() {
  selectedCommand.value = null
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
