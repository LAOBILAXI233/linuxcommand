# Linux Command ZTools 插件

Linux 命令速查手册，包含 600+ 个常用命令的详细说明、语法、选项和实例。

## 功能特性

- ✅ **600+ 命令文档**：涵盖文件管理、网络通讯、系统管理、文本处理等
- 🔍 **智能搜索**：支持模糊匹配、实时搜索
- 📖 **完整文档**：包含命令语法、选项、参数、使用实例
- 💻 **代码高亮**：支持 Shell 命令代码高亮显示
- 🎨 **精美界面**：现代化的 UI 设计

## 使用方法

### 在 ZTools 中使用

1. 安装此插件到 ZTools
2. 输入任意 Linux 命令名称（如 `ls`、`cd`、`grep`）即可触发
3. 或输入 `linux` 浏览所有命令列表

### 搜索示例

- `ls` - 查看 ls 命令详情
- `ssh` - 查看 ssh 命令详情
- `docker` - 查看 docker 命令详情
- `net` - 搜索包含 net 的命令（如 network, netstat）

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite 5
- **Markdown 渲染**：marked + highlight.js
- **数据来源**：[jaywcjlove/linux-command](https://github.com/jaywcjlove/linux-command)

## 项目结构

```
linux-command-ztools/
├── plugin.json          # 插件配置
├── preload.ts           # 预加载脚本
├── src/                 # 源代码
│   ├── App.vue         # 主组件
│   ├── components/     # UI 组件
│   ├── data/           # 数据处理
│   └── utils/          # 工具函数
├── public/
│   ├── logo.svg        # 插件图标
│   └── commands/       # 617 个命令文档
└── dist/                # 构建产物
```

## 开发说明

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 发布到 ZTools 插件中心

```bash
# 确保已安装 CLI 工具
npm install -g @ztools-center/plugin-cli

# 初始化 Git 并提交
git init
git add .
git commit -m "Initial commit"

# 发布
ztools publish
```

## 注意事项

- ⚠️ preload.js 未压缩混淆，符合 ZTools 规范
- ⚠️ 所有命令文档均为 Markdown 格式，保持原项目数据完整性
- ⚠️ 支持离线使用，无需网络连接

## License

MIT License

## 致谢

原始数据来自 [jaywcjlove/linux-command](https://github.com/jaywcjlove/linux-command) 项目。
