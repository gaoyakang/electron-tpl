# electron-tpl

> 基于vite+vitest+ts+react的electron快速开发模板


## 1.功能集成
- 1.工程化：代码格式化✅，Git 工作流✅，vitest测试✅，CI/CD，性能监控，日志✅，文档
- 2.功能化：react-router✅，zustand✅，antd/icon✅,  axios✅
- 3.模块化：app生命周期，window生命周期，创建窗口，窗口设置，ipc通信，快捷键，创建菜单，自动更新，剪贴板
- 4.多窗口配置：
  - 1.渲染进程调用创建窗口：`window.api.setupCreateWindow({})`
  - 2.创建所需单文件文件：renderer/src/settingwin.html且配置script标签和enderer/src/settingwin
  - 3.配置vite打包入口：详见`package.json > renderer > build > rollupOptions > input`
- 5.dll调用：❌
- 6.sqlite3数据库：✅默认数据在/Users/gyk/Library/Application Support/xxx


## 2.启动项目

### 2.1 安装依赖

```bash
pnpm install
```

### 2.2 开发环境

```bash
pnpm dev
```

### 2.3 构建项目

```bash
pnpm build:win

pnpm build:mac

pnpm build:linux
```
