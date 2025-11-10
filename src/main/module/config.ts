import { app } from 'electron'
import * as path from 'path'

export const config = {
  dev: {
    log: {
      logDir: path.join(process.cwd(), 'logs'),
      logName: 'main.log'
    },
    versionUpdate: {
      updateUrl: 'http://localhost:3000/darwin?version=', // 版本更新链接
      updateTitle: '更新可用', // 弹窗标题
      installTitle: '安装更新',
      installMessage: '更新文件已下载完成，即将开始安装。'
    },
    defaultWin: {
      width: 300,
      height: 300,
      maxWidth: 1000,
      maxHeight: 670,
      minHeight: 670,
      minWidth: 250,
      show: false,
      modal: false,
      autoHideMenuBar: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      rendererUrl: process.env['ELECTRON_RENDERER_URL'] || '',
      transparent: false, // 设置窗口透明
      backgroundColor: '#00000000', // 设置背景颜色为透明
      dev: true, // 默认开发环境
      windowName: 'mainwin', // 默认的窗口名称
      frame: true, // 显示窗口边框和标题栏
      hasShadow: true // 显示窗口阴影
    },
    shortcut: {
      // 如果要新增全局快捷键需要在src/main/module/shortcut.ts定义
      closeWindow: 'Ctrl+Q',
      refreshWindow: 'Ctrl+R',
      minimizeWindow: 'Ctrl+M'
    },
    menu: {
      windowMenu: {},
      contextMenu: {},
      trayMenu: {
        toolTip: 'electron-tpl',
        devIconPath: 'build/icons/16x16.png',
        prodIconPath: path.join(app.getAppPath(), '../app.asar.unpacked/resources/tray-icon.ico')
      },
      dockMenu: [
        {
          label: 'New Window',
          click() {
            console.log('New Window')
          },
          icon: 'resources/icon.png'
        },
        {
          label: 'New Window with Settings',
          submenu: [{ label: 'Basic' }, { label: 'Pro' }]
        },
        { label: 'New Command...' }
      ]
    },
    db: {
      dbFile: path.join(app.getPath('userData'), 'app.db'),
      initialTables: [
        `
    CREATE TABLE IF NOT EXISTS user(
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT    NOT NULL,
      age  INTEGER DEFAULT 18
    )` // 这是示例表，其他表继续写 …
      ] // 初始建表语句数组
    }
  },
  prd: {}
}
