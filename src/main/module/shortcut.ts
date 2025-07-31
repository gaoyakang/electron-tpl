import { app, BrowserWindow, globalShortcut } from 'electron'

// 设置窗口大小
export function setupCloseWindowHandler(): void {
  globalShortcut.register('Ctrl+Q', () => {
    app.quit()
  })
}

// 刷新页面
function setupReloadHandler(mainWindow: BrowserWindow): void {
  globalShortcut.register('Ctrl+R', () => {
    mainWindow.reload()
  })
}

// 最小化窗口
function setupMinimizeHandler(mainWindow: BrowserWindow): void {
  globalShortcut.register('Ctrl+M', () => {
    mainWindow.minimize()
  })
}

// 注册所有快捷键处理器
export function registerShortcuts(mainWindow: BrowserWindow): BrowserWindow {
  setupCloseWindowHandler() // 设置关闭窗口快捷键
  setupReloadHandler(mainWindow) // 刷新页面
  setupMinimizeHandler(mainWindow) // 最小化窗口
  return mainWindow
}
