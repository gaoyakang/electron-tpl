import { ElectronAPI } from '@electron-toolkit/preload'
import { promises } from 'dns'
import { DialogOptionsType, BrowserWindowOptions, SqlOp } from '../main/module/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      setupCreateWindow: (options: BrowserWindowOptions) => void // 创建窗口
      setupSetWindowSize: (size: { width: number; height: number }) => void // 设置窗口大小
      setupSetWindowPosition: (position: { x: number; y: number }) => void // 设置窗口大小
      setupMaximizeWindow: () => void // 窗口最大化
      setupMinimizeWindow: () => void // 窗口最小化
      setupUnmaximizeWindow: () => void // 还原窗口
      setupCloseWindow: () => void // 关闭窗口
      setupToggleFullScreen: () => void // 窗口全屏
      setupAlwaysOnTop: (options: { onTop: boolean } = { onTop: true }) => void // 窗口前置
      setupWindowOpacity: (opacity) => void // 设置窗口透明度
      setupFocusWindow: () => void // 窗口聚焦
      pastePic: () => promises<string> // 获取剪切板中的图片
      getAvailableScreensOrWindows: () => Promise<[]> // 获取可用的屏幕或窗口列表
      captureStream: (sourceId: string) => string // 捕获指定屏幕或窗口的流
      showDialog: (options: DialogOptionsType) => string // 显示系统对话框dialog
      createMenu: (options: { x: number; y: number }) => string // 创建menu
      showNotification: (options: {
        title: string
        subtitle?: string
        body?: string
        icon?: string
        sound?: string
        silent?: boolean
        urgency?: 'normal' | 'critical' | 'low'
      }) => string // 显示系统提示
      sendRequest: (options?: { url: string; method: 'GET' | 'POST'; headers }) => string // 发送网络请求
      getPowerMonitorInfo: (options?) => boolean // powerMonitor相关
      purchaseProduct: (productID: string) => boolean // 应用内购买
      autoUpdate: () => void // 自动更新
      getVersion: () => string // 获取应用版本号
      db: (op: SqlOp) => Promise<any> // sqlite数据库操作
    }
  }
}
