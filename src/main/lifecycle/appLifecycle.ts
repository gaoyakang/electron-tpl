import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut } from 'electron'
import { createWindow } from '..//module/createWindow'
import { autoUpdateInit } from '../module/autoUpdater'

// app生命周期
export const setupAppLifecycle = (): void => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    console.log('browser-window-created')
    // 监控窗口的快捷键操作
    optimizer.watchWindowShortcuts(window)
  })

  app.on('will-finish-launching', () => {
    console.log('will-finish-launching')
    // 自动更新
    autoUpdateInit()
  })

  app.on('activate', function () {
    console.log('activate')
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('will-quit', () => {
    // 取消所有快捷键
    globalShortcut.unregisterAll()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
