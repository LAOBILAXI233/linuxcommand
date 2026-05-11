# Linux Command 移植为 ZTools 插件规划

## 📋 项目概述

将 [linux-command-master](https://github.com/jaywcjlove/linux-command)（包含 600+ 个 Linux 命令文档）移植为 ZTools 插件，使用户可以在 ZTools 中快速搜索和查看 Linux 命令的使用说明。

---

## 🎯 目标

- ✅ 将 600+ 个 Linux 命令文档整合到 ZTools 插件中
- ✅ 支持通过命令名快速搜索查询
- ✅ 展示命令的详细文档（语法、选项、参数、实例）
- ✅ 符合 ZTools 插件开发规范
- ✅ 支持发布到 ZTools 插件中心

---

## 📁 项目结构设计

```
linux-command-ztools/
├── plugin.json              # 插件配置文件
├── package.json             # 项目依赖配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 构建配置
├── preload.ts               # 预加载脚本（Node.js API）
├── src/                     # 源代码目录
│   ├── main.ts              # 入口文件
│   ├── App.vue              # 主组件（Vue 3）
│   ├── components/          # 组件目录
│   │   ├── CommandDetail.vue # 命令详情展示组件
│   │   ├── CommandList.vue   # 命令列表组件
│   │   └── SearchBar.vue     # 搜索栏组件
│   ├── data/                # 数据处理
│   │   ├── commands.ts       # 命令数据加载器
│   │   └── types.ts          # 类型定义
│   └── utils/               # 工具函数
│       ├── markdown.ts       # Markdown 解析工具
│       └── search.ts         # 搜索工具
├── public/                  # 静态资源
│   ├── logo.png             # 插件 Logo
│   └── commands/             # 命令文档数据（从原项目复制）
│       ├── ls.md
│       ├── cd.md
│       ├── ...
│       └── (600+ 个 .md 文件)
└── dist/                    # 构建输出目录
```

---

## 🔧 技术方案

### 1. **插件配置 (plugin.json)**

```json
{
  "name": "linux-command",
  "title": "Linux 命令文档",
  "description": "Linux 命令速查手册，包含 600+ 个常用命令的详细说明、语法、选项和实例",
  "version": "1.0.0",
  "main": "index.html",
  "logo": "logo.png",
  "preload": "preload.js",
  "features": [
    {
      "code": "linux-command-search",
      "explain": "查询 Linux 命令用法",
      "cmds": [
        {
          "type": "regex",
          "label": "Linux 命令查询",
          "match": "/^[a-z][a-z0-9-]*$/i",
          "minLength": 2
        }
      ]
    },
    {
      "code": "linux-command-list",
      "explain": "浏览所有 Linux 命令",
      "cmds": ["linux", "linux command", "命令"]
    }
  ]
}
```

### 2. **触发指令策略**

#### 方案 A：正则匹配（推荐）
- 使用 `RegexCmd` 匹配用户输入的命令名
- 当用户输入类似 `ls`, `cd`, `grep` 等 Linux 命令时触发
- 最小字符长度设为 2，避免过于频繁触发

#### 方案 B：全局匹配（备选）
- 使用 `OverCmd` 处理所有输入
- 在用户输入时实时显示相关命令建议
- 适用于更智能的场景

### 3. **数据管理**

#### 数据来源
- 从原项目 `command/` 目录复制所有 `.md` 文件
- 共计 600+ 个命令文档

#### 数据处理流程
1. **构建时预处理**：将所有 `.md` 文件转换为 JSON 格式，生成索引
2. **运行时加载**：按需加载命令文档，避免一次性加载过大
3. **缓存机制**：已访问过的命令文档缓存在内存中

#### 数据结构设计
```typescript
interface Command {
  name: string;           // 命令名称（如 ls, cd）
  description: string;    // 命令描述
  syntax: string;         // 语法格式
  options: Option[];      // 选项列表
  parameters: Parameter[]; // 参数说明
  examples: Example[];    // 使用实例
  content: string;        // 原始 Markdown 内容
}

interface Option {
  flag: string;           // 选项标志（如 -l, -a）
  description: string;    // 选项说明
}

interface Example {
  code: string;           // 示例代码
  output?: string;        // 输出结果
  description?: string;   // 示例说明
}
```

### 4. **UI 设计**

#### 主界面布局
```
┌─────────────────────────────────────┐
│  🔍 搜索 Linux 命令...              │  ← 搜索框
├─────────────────────────────────────┤
│                                     │
│  📋 命令详情                        │
│  ────────────────────────────────   │
│  ## ls                             │
│  显示目录内容列表                   │
│                                     │
│  ### 语法                          │
│  ls [选项] [文件名...]              │
│                                     │
│  ### 常用选项                       │
│  -l  详细列表                      │
│  -a  显示隐藏文件                  │
│  ...                               │
│                                     │
│  ### 实例                          │
│  $ ls -la                          │
│  ...                               │
│                                     │
└─────────────────────────────────────┘
```

#### 功能特性
- **实时搜索**：输入即时过滤命令列表
- **语法高亮**：代码块语法高亮显示
- **Markdown 渲染**：完整支持 Markdown 格式
- **分类浏览**：按命令分类浏览（文件管理、网络通讯等）
- **收藏功能**：收藏常用命令（可选）

### 5. **Preload 脚本功能**

```typescript
// preload.ts
const fs = require('fs');
const path = require('path');

// 提供文件读取 API 给前端
window.linuxCommandAPI = {
  // 读取单个命令文档
  getCommand: (commandName: string): string => {
    const filePath = path.join(__dirname, 'public/commands', `${commandName}.md`);
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  },

  // 获取所有命令列表
  getCommandList(): string[] {
    const commandsDir = path.join(__dirname, 'public/commands');
    const files = fs.readdirSync(commandsDir);
    return files
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md','));
  },

  // 搜索命令（模糊匹配）
  searchCommands: (keyword: string): string[] => {
    const commands = this.getCommandList();
    return commands.filter(cmd =>
      cmd.toLowerCase().includes(keyword.toLowerCase())
    );
  }
};
```

---

## 📝 实施步骤

### **阶段一：环境准备与基础搭建**

1. **安装 ZTools CLI 工具**
   ```bash
   npm install -g @ztools-center/plugin-cli
   ```

2. **创建插件项目**
   ```bash
   ztools create linux-command-ztools
   # 选择 Vue + TypeScript + Vite 模板
   ```

3. **配置项目信息**
   - Plugin name: `linux-command`
   - Plugin title: `Linux 命令文档`
   - Plugin description: `Linux 命令速查手册`
   - Author: 你的名字

4. **进入项目并安装依赖**
   ```bash
   cd linux-command-ztools
   npm install
   ```

### **阶段二：数据处理与集成**

5. **复制命令文档**
   ```bash
   # 从原项目复制 command 目录到 public/commands
   cp -r ../linux-command-master/command/* public/commands/
   ```

6. **创建数据解析模块**
   - 实现 Markdown 解析器
   - 提取命令元数据（名称、描述、语法等）
   - 生成命令索引文件（用于快速搜索）

7. **实现数据加载器**
   - 按需加载机制
   - 缓存管理
   - 错误处理

### **阶段三：UI 开发**

8. **开发主界面组件**
   - 搜索框组件（支持实时搜索）
   - 命令详情展示组件
   - 命令列表组件（带分类）

9. **实现 Markdown 渲染**
   - 集成 Markdown 解析库（如 marked + highlight.js）
   - 代码高亮
   - 表格渲染

10. **优化用户体验**
    - 键盘快捷键支持
    - 响应式布局
    - 加载状态提示

### **阶段四：功能完善**

11. **实现搜索功能**
    - 模糊搜索算法
    - 搜索结果排序（相关性）
    - 搜索历史记录

12. **添加高级功能（可选）**
    - 命令分类筛选
    - 收藏常用命令
    - 最近查看记录
    - 深色模式支持

13. **性能优化**
    - 虚拟滚动（长列表）
    - 懒加载
    - 数据预取

### **阶段五：测试与发布**

14. **本地测试**
    ```bash
    npm run dev
    ```
    - 测试所有核心功能
    - 验证不同命令的展示效果
    - 测试搜索准确性

15. **构建插件**
    ```bash
    npm run build
    ```

16. **初始化 Git 仓库**
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Linux Command ZTools Plugin"
    ```

17. **发布到 ZTools 插件中心**
    ```bash
    ztools publish
    ```

18. **完善 PR 信息**
    - 上传截图/演示 GIF
    - 勾选自检清单
    - 将 PR 标记为 Ready for review

---

## 🎨 UI/UX 设计要点

### 视觉风格
- **简洁专业**：采用清爽的设计风格，突出内容
- **代码友好**：优化的代码块样式，适合技术文档
- **响应式**：适配不同窗口尺寸

### 交互设计
- **即时响应**：输入即搜索，无需按回车
- **快捷导航**：支持键盘上下箭头选择
- **清晰层级**：明确的信息层次结构

### 配色方案（参考）
- 主色调：蓝色系（符合 Linux 技术风格）
- 背景：浅色/深色主题可切换
- 强调色：用于高亮重要信息

---

## ⚠️ 注意事项与风险

### 1. **性能考量**
- **问题**：600+ 个 Markdown 文件体积较大
- **解决方案**：
  - 按需加载，不一次性全部读取
  - 构建时预处理，生成轻量级索引
  - 使用虚拟滚动优化长列表渲染

### 2. **数据完整性**
- **问题**：原始 Markdown 格式可能不统一
- **解决方案**：
  - 编写健壮的解析器，容错处理
  - 对异常格式提供友好的错误提示
  - 保留原始内容作为后备显示

### 3. **ZTools 规范遵循**
- **必须遵守**：
  - preload.js 不能压缩混淆
  - 第三方库需提交源码
  - plugin.json 字段完整
- **建议**：
  - 代码注释清晰
  - 遵循最佳实践

### 4. **兼容性**
- **平台支持**：Windows/macOS/Linux
- **ZTools 版本**：确保兼容最新版 ZTools
- **依赖版本**：锁定关键依赖版本

---

## 📊 项目时间估算

| 阶段 | 任务 | 预估工作量 |
|------|------|-----------|
| 阶段一 | 环境准备与基础搭建 | 30 分钟 |
| 阶段二 | 数据处理与集成 | 2-3 小时 |
| 阶段三 | UI 开发 | 4-6 小时 |
| 阶段四 | 功能完善 | 2-3 小时 |
| 阶段五 | 测试与发布 | 1-2 小时 |
| **总计** | | **10-15 小时** |

---

## 🚀 后续扩展方向（可选）

1. **离线优先**：完全离线使用，无需网络
2. **多语言支持**：添加英文等其他语言版本
3. **用户贡献**：允许用户添加自定义命令笔记
4. **智能推荐**：基于使用场景推荐相关命令
5. **命令关系图**：可视化展示命令之间的关联
6. **练习模式**：提供命令练习和测试功能

---

## 📚 参考资源

- [ZTools 开发文档](https://ztoolscenter.github.io/ZTools-doc/)
- [plugin.json 配置规范](https://ztoolscenter.github.io/ZTools-doc/plugin-json.html)
- [preload.js 规范](https://ztoolscenter.github.io/ZTools-doc/preload-js.html)
- [原项目 GitHub](https://github.com/jaywcjlove/linux-command)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Vite 文档](https://vitejs.cn/)

---

## ✅ 验收标准

1. **功能完整性**
   - [ ] 能够搜索并展示 600+ 个 Linux 命令
   - [ ] 命令详情包含完整的语法、选项、参数、实例
   - [ ] 搜索响应迅速（< 100ms）
   - [ ] UI 渲染正确，无错乱

2. **规范性**
   - [ ] plugin.json 配置完整且符合规范
   - [ ] preload.js 清晰可读，未压缩混淆
   - [ ] 代码结构清晰，注释完整
   - [ ] 通过 ZTools CLI 构建无报错

3. **用户体验**
   - [ ] 界面美观，交互流畅
   - [ ] 支持键盘操作
   - [ ] 加载状态提示友好
   - [ ] 错误处理完善

4. **发布要求**
   - [ ] 成功发布到 ZTools 插件中心
   - [ ] PR 包含截图和演示
   - [ ] 通过审核检查清单

---

## 💡 关键决策点

### 决策 1：UI 框架选择
**选择**：Vue 3 + TypeScript
**理由**：
- ZTools CLI 提供 Vue 模板，开箱即用
- TypeScript 提供类型安全
- Vue 3 Composition API 适合复杂交互

### 决策 2：数据存储方式
**选择**：静态 Markdown 文件 + 运行时解析
**理由**：
- 保持原项目数据格式，易于同步更新
- 避免构建时转换的数据过期问题
- 利用 preload 直接读取文件，性能好

### 决策 3：搜索实现方式
**选择**：客户端模糊搜索 + 正则匹配
**理由**：
- 无需服务端，完全离线可用
- 响应速度快
- 符合 ZTools 插件的轻量级定位

### 决策 4：Markdown 渲染库
**选择**：marked + highlight.js
**理由**：
- marked：轻量、高性能 Markdown 解析器
- highlight.js：优秀的代码高亮库
- 社区活跃，文档完善

---

## 🎉 总结

本规划将 linux-command-master 成功移植为 ZTools 插件，让用户能够在 ZTools 中便捷地查询 Linux 命令。项目充分利用了原项目的丰富数据资源，结合 ZTools 的插件能力，提供了流畅的用户体验。

通过分阶段实施，可以系统性地完成移植工作，确保质量和进度可控。最终产出的插件将为广大 Linux 用户和开发者提供实用的命令查询工具。
