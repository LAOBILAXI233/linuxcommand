export interface Command {
  name: string;
  description: string;
  content: string;
}

export interface CommandListItem {
  name: string;
  description: string;
}

declare global {
  interface Window {
    linuxCommandAPI: {
      getCommand: (commandName: string) => string | null;
      getCommandList: () => string[];
      searchCommands: (keyword: string) => string[];
    };
  }
}
