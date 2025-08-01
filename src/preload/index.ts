import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  setupCreateWindow: (name) => ipcRenderer.invoke('create-window', name), // 创建窗口
  setupSetWindowSize: (options) => ipcRenderer.invoke('set-window-size', options), // 设置窗口大小
  setupSetWindowPosition: (options) => ipcRenderer.invoke('set-window-position', options), // 设置窗口位置
  setupFocusWindow: () => ipcRenderer.invoke('focus-window'), // 窗口聚焦
  setupWindowOpacity: (opacity) => ipcRenderer.invoke('set-window-opacity', opacity), // 设置窗口透明度
  setupAlwaysOnTop: (options) => ipcRenderer.invoke('set-always-on-top', options), // 窗口前置
  setupToggleFullScreen: () => ipcRenderer.invoke('toggle-full-screen'), // 窗口全屏
  setupMaximizeWindow: () => ipcRenderer.invoke('maximize-window'), // 最大化窗口
  setupMinimizeWindow: () => ipcRenderer.invoke('minimize-window'), // 最小化窗口
  setupUnmaximizeWindow: () => ipcRenderer.invoke('unmaximize-window'), // 还原窗口
  setupCloseWindow: () => ipcRenderer.invoke('close-window'), // 关闭窗口
  pastePic: () => ipcRenderer.invoke('paste-picture'), // 获取剪切板中的图片
  getAvailableScreensOrWindows: () => ipcRenderer.invoke('get-available-screens-or-windows'), // 获取所有可显示的屏幕和窗口信息
  captureStream: (sourceId) => ipcRenderer.invoke('capture-stream', sourceId), // 将要获取的id传回
  showDialog: (options) => ipcRenderer.invoke('show-dialog', options), // 显示系统对话框dialog
  createMenu: (options) => ipcRenderer.invoke('create-menu', options), // 创建菜单
  showNotification: (options) => ipcRenderer.invoke('show-notifications', options), // 显示系统提示
  sendRequest: (options) => ipcRenderer.invoke('send-request', options), // 发送网络请求
  getPowerMonitorInfo: (options) => ipcRenderer.invoke('power-monitor', options), // powerMonitor相关
  purchaseProduct: (productID) => ipcRenderer.invoke('purchase-product', productID), //  应用内购买
  autoUpdate: () => ipcRenderer.invoke('auto-update'), // 自动更新
  getVersion: () => ipcRenderer.invoke('get-version') // 获取应用版本号
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
