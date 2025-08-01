import { BrowserWindow, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { EventCallback, EventName, WindowEventConfig } from '../module/types'

// 管理窗口生命周期
// 具体参考：https://www.electronjs.org/zh/docs/latest/api/browser-window#class-browserwindow
export const manageWindowLifecycle = (
  mainWindow: BrowserWindow,
  // 可选地传入事件配置
  eventConfigs: WindowEventConfig[] = []
): BrowserWindow => {
  // 默认的窗口生命周期事件
  const defaultEventConfigs: WindowEventConfig[] = [
    {
      name: 'ready-to-show' as EventName,
      callback: (mainWindow) => mainWindow.show(),
      once: true
    }
  ]

  // 合并默认事件配置和用户传入的事件配置
  const combinedEventConfigs = [...defaultEventConfigs, ...eventConfigs]

  // 事件处理器
  const handleEvent = (
    eventName: EventName, // 窗口生命周期名字
    callback: EventCallback, // 窗口生命周期回调函数
    once = false // 控制事件监听器是否只触发一次。
  ): void => {
    const listener = (...args: unknown[]): void => callback(mainWindow, ...args)

    // 只触发一次
    if (once) {
      mainWindow.once(eventName, listener)
    } else {
      // 一直触发
      mainWindow.on(eventName, listener)
    }
  }

  // 处理默认事件
  combinedEventConfigs.forEach((config) => {
    handleEvent(config.name, config.callback, config.once)
  })

  // 处理默认的窗口打开行为
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 返回窗口实例
  return mainWindow
}
