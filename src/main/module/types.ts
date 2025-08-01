import { BrowserWindow } from 'electron'

// createWindow.ts中新建窗口的选项
export interface BrowserWindowOptions {
  // 尺寸相关
  width?: number // 窗口宽度
  height?: number // 窗口高度
  maxWidth?: number // 最大窗口宽度
  maxHeight?: number // 最大窗口高度
  minWidth?: number // 最小窗口宽度
  minHeight?: number // 最小窗口高度

  // 显示相关
  show?: boolean // 是否显示
  autoHideMenuBar?: boolean // 自动隐藏菜单栏
  rendererUrl?: string // 渲染内容的url
  transparent?: boolean // 是否透明
  backgroundColor?: string // 背景色

  // 权限相关
  preload?: string // preload文件地址
  sandbox?: boolean // 是否沙盒化，将渲染进程与底层操作系统资源隔离，限制渲染进程对文件系统、网络等的直接访问权限
  contextIsolation?: boolean // 上下文隔离，隔离预加载脚本与网页内容的上下文环境，确保两者使用独立的 window 对象
  dev?: boolean // 是否为开发者模式
  windowName?: string // 窗口名称,它需要保证render/src/xx 和xx.html 文件名一致
}

// windowLifecycle.ts中窗口生命周期相关的类型
// 定义事件处理函数的类型
export type EventName = keyof BrowserWindow['on']
export type EventCallback = (browser: BrowserWindow, ...args: unknown[]) => void

// 窗口事件处理配置
export interface WindowEventConfig {
  name: EventName // 窗口生命周期名字
  callback: EventCallback // 窗口生命周期回调函数
  once?: boolean // 控制事件监听器是否只触发一次。
}

// registerIPCEvents.ts中可用窗口或屏幕源的配置
export interface processedSourcesType {
  id: string
  name: string
  thumbnail: string | null
  appIcon: string | null
  display_id?: string
}

// egisterIPCEvents.ts中dialog参数配置
export interface DialogOptionsType {
  type: 'showMessageBox' | 'showOpenDialog' | 'showSaveDialog' | 'showErrorBox'
  params: {
    showMessageBox?: {
      message: string
      detail: string
      type: 'info' | 'error' | 'question' | 'warning'
      title: string
      checkboxLabel?: string
      checkboxChecked?: boolean
      buttons?: string[]
    }
    showOpenDialog?: {
      title: string
      buttonLabel: string
      filters: { name: string; extensions: string[] }[]
      properties: ('openFile' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory')[]
      message?: string
      securityScopedBookmarks?: boolean
    }
    showSaveDialog?: {
      title: string
      defaultPath?: string
      buttonLabel: string
      filters: { name: string; extensions: string[] }[]
      message?: string
      nameFieldLabel?: string
      showsTagField?: boolean
      properties?: ('showHiddenFiles' | 'createDirectory')[]
      securityScopedBookmarks?: boolean
    }
    showErrorBox?: {
      title: string
      content: string
    }
  }
}
