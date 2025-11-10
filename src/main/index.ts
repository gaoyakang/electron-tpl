import { app, BrowserWindow } from 'electron'
import { createWindow } from './module/createWindow'
import { registerIPCEvents } from './module/registerIPCEvents'
import { setupAppLifecycle } from './lifecycle/appLifecycle'
import { registerShortcuts } from './module/shortcut'
import { initMenu } from './module/createMenu'
import { initlog } from './module/initLog'
import { BetterSqliteWrapper } from './module/sqlite3'
import { config } from './module/config'
// app生命周期
app.whenReady().then(() => {
  // 0.初始化日志
  initlog()
  // 1.数据库初始化
  BetterSqliteWrapper['_ins'] = new BetterSqliteWrapper(config.dev.db.dbFile) // 私有字段绕过 TS 检查
  BetterSqliteWrapper.ins.openDB()
  BetterSqliteWrapper.ins.initTables() // 初始化表结构
  // 2.创建主窗口
  let mainWindow: BrowserWindow = createWindow()
  // 3.注册ipc相关事件
  mainWindow = registerIPCEvents(mainWindow)
  // 4.注册快捷键
  mainWindow = registerShortcuts(mainWindow)
  // 5.初始化菜单
  initMenu(mainWindow)
})
// 2.设置app生命周期
setupAppLifecycle()
