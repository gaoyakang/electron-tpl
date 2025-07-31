import { app, BrowserWindow } from 'electron'
import { createWindow } from './module/createWindow'
import { registerIPCEvents } from './module/registerIPCEvents'
import { setupAppLifecycle } from './lifecycle/appLifecycle'
import { registerShortcuts } from './module/shortcut'
import { initMenu } from './module/createMenu'

// app生命周期
app.whenReady().then(() => {
  // 1.创建主窗口
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
