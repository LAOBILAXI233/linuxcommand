const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, 'public/commands');

window.linuxCommandAPI = {
  getCommand: function(commandName) {
    const filePath = path.join(commandsDir, commandName + '.md');
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
      return null;
    } catch (error) {
      console.error('Error reading command file:', error);
      return null;
    }
  },

  getCommandList: function() {
    try {
      if (!fs.existsSync(commandsDir)) {
        return [];
      }
      const files = fs.readdirSync(commandsDir);
      return files
        .filter(function(f) { return f.endsWith('.md'); })
        .map(function(f) { return f.replace('.md', ''); })
        .sort();
    } catch (error) {
      console.error('Error reading commands directory:', error);
      return [];
    }
  },

  searchCommands: function(keyword) {
    var commands = this.getCommandList();
    var lowerKeyword = keyword.toLowerCase();
    return commands.filter(function(cmd) {
      return cmd.toLowerCase().includes(lowerKeyword);
    });
  }
};
