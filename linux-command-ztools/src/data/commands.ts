import { Command, CommandListItem } from './types';

const commandCache = new Map<string, Command>();

function extractDescription(content: string): string {
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('## ') || line.startsWith('# ')) {
      continue;
    }
    
    if (line === '===' || line === '---') {
      continue;
    }
    
    if (line.length > 10 && line.length < 200) {
      return line.replace(/\*\*/g, '');
    }
  }
  
  return '';
}

export function getCommand(commandName: string): Command | null {
  if (commandCache.has(commandName)) {
    return commandCache.get(commandName)!;
  }

  if (!window.linuxCommandAPI) {
    console.error('linuxCommandAPI not available');
    return null;
  }

  const content = window.linuxCommandAPI.getCommand(commandName);
  if (!content) {
    return null;
  }

  const command: Command = {
    name: commandName,
    description: extractDescription(content),
    content: content
  };

  commandCache.set(commandName, command);
  return command;
}

export function getCommandList(): CommandListItem[] {
  if (!window.linuxCommandAPI) {
    console.error('linuxCommandAPI not available');
    return [];
  }

  const commands = window.linuxCommandAPI.getCommandList();
  
  return commands.map(name => ({
    name: name,
    description: ''
  }));
}

export function searchCommands(keyword: string): string[] {
  if (!window.linuxCommandAPI) {
    console.error('linuxCommandAPI not available');
    return [];
  }

  return window.linuxCommandAPI.searchCommands(keyword);
}
