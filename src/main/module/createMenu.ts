import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow, Menu, MenuItemConstructorOptions, nativeImage, Tray } from 'electron'
import { config } from './config'

// 1.创建窗口菜单
function createWindowMenu(windowInstance: BrowserWindow): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          label: '开发者模式',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: (menuItem, window, event) => {
            console.log('Toggle Developer Tools clicked')
            console.log(menuItem, window, event)
            windowInstance.webContents.toggleDevTools()
          }
        },
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          // 强制刷新
          label: '强制刷新',
          accelerator: 'CmdOrCtrl+R',
          role: 'forceReload'
        }
      ]
    }
  ]
  // 创建菜单对象
  const menu = Menu.buildFromTemplate(template)
  // 设置应用的主菜单
  if (process.platform === 'darwin') {
    // MacOS 下，菜单会自动添加到顶部菜单栏
    Menu.setApplicationMenu(menu)
  } else {
    // Windows 和 Linux 下，需要手动将菜单设置为主窗口的菜单
    const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
    mainWindow.setMenu(menu)
  }
}

// 2.创建上下文菜单
function createContextMenu(windowInstance: BrowserWindow): void {
  // 定义菜单模板
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        }
      ]
    }
  ]
  // 创建菜单对象
  const menu = Menu.buildFromTemplate(template)

  // 监听右键菜单事件
  windowInstance.webContents.on('context-menu', (_e, params) => {
    menu.popup({
      window: windowInstance,
      x: params.x,
      y: params.y
    })
  })
}

// 3.托盘菜单
async function createTrayMenu(): Promise<void> {
  const prodIconPath = config.dev.menu.trayMenu.prodIconPath

  const iconPath = is.dev ? config.dev.menu.trayMenu.devIconPath : prodIconPath

  const trayIcon = nativeImage.createFromPath(iconPath)
  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio', click: () => handleMenuItemClick(1) },
    { label: 'Item3', type: 'radio', checked: true }
  ])
  tray.setToolTip(config.dev.menu.trayMenu.toolTip)
  tray.setContextMenu(contextMenu)
}
// 处理菜单项点击事件的函数
function handleMenuItemClick(menuItemIndex): void {
  console.log(`Item ${menuItemIndex} clicked`)
  // 在这里添加你想要执行的代码
}

// 4.Dock 菜单
function createDockMenu(): void {
  const dockMenu = Menu.buildFromTemplate(config.dev.menu.dockMenu)
  app.dock?.setMenu(dockMenu)
}

export function initMenu(windowInstance: BrowserWindow): BrowserWindow {
  createContextMenu(windowInstance)
  createWindowMenu(windowInstance)
  createTrayMenu()
  createDockMenu()
  return windowInstance
}
