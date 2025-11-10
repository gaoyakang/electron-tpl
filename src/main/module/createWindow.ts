import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { join } from 'path'
import { BrowserWindowOptions, WindowEventConfig } from './types'
import { manageWindowLifecycle } from '../lifecycle/windowLifecycle'
import { is } from '@electron-toolkit/utils'
import { config } from './config'

export const createWindow = (
  userBrowserWindowOptions: BrowserWindowOptions = {}
): BrowserWindow => {
  // 默认窗口属性，后期增加的可以继续添加到这里
  const defaultBrowserWindowOptions = config.dev.defaultWin

  // 合并默认配置和传入的配置
  const mergedBrowserWindowOptions = { ...defaultBrowserWindowOptions, ...userBrowserWindowOptions }

  // 创建窗口
  let mainWindow = new BrowserWindow({
    // 层级
    parent: mergedBrowserWindowOptions.parent,
    modal: mergedBrowserWindowOptions.modal,
    // 尺寸相关
    width: mergedBrowserWindowOptions.width,
    height: mergedBrowserWindowOptions.height,
    maxWidth: mergedBrowserWindowOptions.maxWidth,
    maxHeight: mergedBrowserWindowOptions.maxHeight,
    minHeight: mergedBrowserWindowOptions.minHeight,
    minWidth: mergedBrowserWindowOptions.minWidth,
    // 显示相关
    show: mergedBrowserWindowOptions.show,
    autoHideMenuBar: mergedBrowserWindowOptions.autoHideMenuBar,
    transparent: mergedBrowserWindowOptions.transparent,
    backgroundColor: mergedBrowserWindowOptions.backgroundColor,
    frame: mergedBrowserWindowOptions.frame,
    hasShadow: mergedBrowserWindowOptions.hasShadow,
    // titleBarStyle: 'hidden', // 隐藏默认标题栏，其余不可拖动，可添加app-region: drag 样式重新定位窗口
    // 平台相关
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: mergedBrowserWindowOptions.preload || join(__dirname, '../preload/index.js'),
      sandbox: mergedBrowserWindowOptions.sandbox,
      spellcheck: true // 拼写检查
    }
  })

  // 处理窗口生命周期
  mainWindow = manageWindowLifecycle(mainWindow, [
    // {
    //   name: 'close',
    //   callback: (mainWindow) => {
    //     console.log('尝试关闭窗口')
    //     // 这里可以添加自定义关闭逻辑
    //     mainWindow.close()
    //     app.quit()
    //   },
    //   once: true
    // }
  ] as WindowEventConfig[])

  // 加载内容
  if (is.dev) {
    // 开发环境下加载url
    mainWindow.loadURL(
      process.env['ELECTRON_RENDERER_URL'] + '/' + mergedBrowserWindowOptions.windowName || ''
    )
    // 开发环境下自动打开 DevTools
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // 生产环境下打开打包的html
    mainWindow.loadFile(
      join(__dirname, `../renderer/${mergedBrowserWindowOptions.windowName}.html`)
    )
  }

  // 返回窗口实例
  return mainWindow
}
