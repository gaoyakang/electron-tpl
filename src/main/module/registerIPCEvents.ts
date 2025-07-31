import {
  BrowserWindow,
  desktopCapturer,
  dialog,
  ipcMain,
  session,
  ShareMenu,
  Notification,
  net,
  powerMonitor,
  app
} from 'electron'
import ClipboardManager from './ClipboardManager'
import { DialogOptionsType, processedSourcesType } from './types'
import { autoUpdateInit } from './autoUpdater'
// 设置窗口大小
function setupSetWindowSizeHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle(
    'set-window-size',
    async (_e, options: { width: number; height: number }): Promise<string> => {
      windowInstance.setSize(options.width, options.height)
      return 'set-window-size success'
    }
  )
}

// 设置窗口位置
function setupSetWindowPositionHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle(
    'set-window-position',
    async (_e, options: { x: number; y: number }): Promise<string> => {
      windowInstance.setPosition(options.x, options.y)
      return 'set-window-position success'
    }
  )
}

// 最大化窗口
function setupMaximizeWindowHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('maximize-window', async (): Promise<string> => {
    if (!windowInstance.isMaximized()) {
      windowInstance.maximize()
      return 'maximize-window success'
    }
    return 'maximize-window fail'
  })
}

// 最小化窗口
function setupMinimizeWindowHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('minimize-window', async (): Promise<string> => {
    if (!windowInstance.isMinimized()) {
      windowInstance.minimize()
      return 'minimize-window success'
    }
    return 'minimize-window fail'
  })
}

// 还原窗口
function setupUnmaximizeWindowHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('unmaximize-window', async (): Promise<string> => {
    if (windowInstance.isMaximized()) {
      windowInstance.unmaximize()
      return 'unmaximize-window success'
    }
    return 'unmaximize-window fail'
  })
}

// 关闭窗口
function setupCloseWindowHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('close-window', async (): Promise<string> => {
    windowInstance.close()
    return 'close-window success'
  })
}

// 切换窗口全屏模式
function setupToggleFullScreenHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('toggle-full-screen', async (): Promise<string> => {
    windowInstance.setFullScreen(!windowInstance.isFullScreen())
    return 'toggle-full-screen success'
  })
}

// 设置窗口始终在最前端
function setupAlwaysOnTopHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle(
    'set-always-on-top',
    async (_e, options: { onTop: boolean } = { onTop: true }): Promise<string> => {
      windowInstance.setAlwaysOnTop(options.onTop)
      return 'set-always-on-top success'
    }
  )
}

// 设置窗口透明度
function setupWindowOpacityHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('set-window-opacity', async (_e, opacity: number): Promise<string> => {
    windowInstance.setOpacity(opacity)
    return 'set-window-opacity success'
  })
}

// 窗口聚焦
function setupFocusWindowHandler(windowInstance: BrowserWindow): void {
  ipcMain.handle('focus-window', async (): Promise<string> => {
    if (!windowInstance.isFocused()) {
      windowInstance.focus()
      return 'focus-window success'
    }
    return 'focus-window fail'
  })
}

// 获取剪切板中的图片
function setupPastePicHandler(): void {
  ipcMain.handle('paste-picture', async (): Promise<string> => {
    const image = ClipboardManager.readImage()
    const imageData = image.toDataURL() // 获取图片的Base64数据
    return imageData
  })
}

// 获取所有可显示的屏幕和窗口信息
function setupGetAvailableScreensHandler(): void {
  ipcMain.handle('get-available-screens-or-windows', async (): Promise<processedSourcesType[]> => {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'], // 设定需要捕获的是"屏幕"，还是"窗口"
      thumbnailSize: {
        height: 300, // 窗口或屏幕的截图快照高度
        width: 300 // 窗口或屏幕的截图快照宽度
      },
      fetchWindowIcons: true // 如果视频源是窗口且有图标，则设置该值可以捕获到的窗口图标
    })
    const processedSources = sources.map((source) => ({
      ...source,
      thumbnail: source.thumbnail ? source.thumbnail.toDataURL() : null,
      appIcon: source.appIcon ? source.appIcon.toDataURL() : null
    }))
    return processedSources
  })
}

// 获取所选屏幕或窗口的id的视频流
function setupCaptureStreamHandler(): void {
  ipcMain.handle('capture-stream', async (_e, sourceid: string): Promise<string> => {
    console.log('Received sourceId:', sourceid)
    // 清理之前的 handler
    session.defaultSession.setDisplayMediaRequestHandler(null)

    // 设置屏幕共享请求的处理器
    session.defaultSession.setDisplayMediaRequestHandler((_request, callback) => {
      desktopCapturer
        .getSources({ types: ['screen', 'window'] })
        .then((sources) => {
          const normalizedSourceId = JSON.parse(sourceid)

          const source = sources.find((s) => s.id === normalizedSourceId)

          if (source) {
            callback({ video: source })
          } else {
            callback({})
          }
        })
        .catch((error) => {
          console.error('Error getting sources:', error)
          callback({})
        })
    })
    return 'ok'
  })
}

// dialog相关
// 处理showMessageBox参数
async function processShowMessageBoxParams(windowInstance, options): Promise<string> {
  let result: string | string[] | void = ''
  const response = await dialog.showMessageBox(windowInstance, {
    ...options.params.showMessageBox
  })
  if (response.response === 0) {
    console.log('用户点击了“确定”按钮')
    result = '确定按钮被点击'
  } else if (response.response === 1) {
    console.log('用户点击了“取消”按钮')
    result = '取消按钮被点击'
  }
  return result
}

// 处理showOpenDialog参数
async function processShowOpenDialogParams(
  windowInstance,
  options
): Promise<string | string[] | void> {
  let result: string | string[] | void = ''
  const { canceled, filePaths } = await dialog.showOpenDialog(windowInstance, {
    ...options.params.showOpenDialog
  })
  if (!canceled) {
    console.log('Selected files:', filePaths)
    result = filePaths
  } else {
    console.log('User canceled the dialog')
    result = 'User canceled the dialog'
  }
  return result
}

// 处理showSaveDialog参数
async function processShowSaveDialogParams(windowInstance, options): Promise<string> {
  let result: string | string[] | void = ''
  const { canceled: saveCanceled, filePath } = await dialog.showSaveDialog(windowInstance, {
    ...options.params.showSaveDialog
  })
  if (!saveCanceled) {
    console.log('Selected file path:', filePath)
    result = filePath
  } else {
    console.log('User canceled the dialog')
    result = 'User canceled the dialog'
  }
  return result
}

// 处理showErrorBox参数
async function processShowErrorBoxParams(options): Promise<string> {
  let result: string | string[] | void = ''
  dialog.showErrorBox(options.params.showErrorBox.title, options.params.showErrorBox.content)
  result = 'Error box displayed'
  return result
}

// 显示系统对话框dialog
async function setupShowDialogHandler(windowInstance): Promise<void> {
  ipcMain.handle(
    'show-dialog',
    async (_e, options: DialogOptionsType): Promise<string | string[] | void> => {
      let result: string | string[] | void = ''

      switch (options.type) {
        case 'showMessageBox':
          processShowMessageBoxParams(windowInstance, options)
          break

        case 'showOpenDialog':
          processShowOpenDialogParams(windowInstance, options)
          break

        case 'showSaveDialog':
          processShowSaveDialogParams(windowInstance, options)
          break

        case 'showErrorBox':
          processShowErrorBoxParams(options)
          break

        default:
          result = 'Unknown dialog type'
      }

      return result
    }
  )
}

// menu相关
async function setupCreateMenuHandler(windowInstance): Promise<void> {
  ipcMain.handle('create-menu', async (_e, options): Promise<string> => {
    // 创建 ShareMenu 对象
    const shareMenu = new ShareMenu({
      filePaths: [
        '/Users/gyk/Desktop/electron-study/1.code/5.常用API/7-menu/electron-app/build/icon.png'
      ],
      texts: ['hello', 'world']
      // urls: ['https://www.baidu.com']
    })

    // 显示分享菜单
    shareMenu.popup({
      window: windowInstance,
      x: options.x,
      y: options.y
    })
    return 'create-menu success'
  })
}

// Notification相关
async function setupShowNotificationHandler(): Promise<void> {
  ipcMain.handle('show-notifications', async (_e, options): Promise<string> => {
    // 检查系统是否支持通知
    if (Notification.isSupported()) {
      const { title, subtitle, body, icon, silent, sound, urgency } = options
      // 创建一个新的通知
      const notification = new Notification({
        title,
        subtitle,
        body,
        icon,
        silent, // 是否静默通知，即无声音提示
        sound: sound ? sound : '/resources/alert.mp3',
        urgency: urgency ? urgency : 'normal',
        // toastXml: '', // win32生效
        actions: [
          {
            // （仅限于 Windows 和 macOS）自定义操作按钮
            type: 'button',
            text: '详情'
          }
        ]
      })

      // 监听通知的点击事件
      notification.on('click', () => {
        console.log('用户点击了通知')
        // 在这里执行点击通知后的操作
      })

      // 显示通知
      notification.show()
    } else {
      console.log('当前系统不支持通知')
    }
    return 'show-notification'
  })
}

// http请求
async function setupSendRequestHandler(): Promise<void> {
  ipcMain.handle('send-request', async (_e, options): Promise<string> => {
    // console.log('send-request', _e, options)
    // 发起请求
    // https://www.cnuseful.com/api/index/weiboHot
    // 1.解析主机名
    // { endpoints: [ { address: '171.121.41.202', family: 'ipv4' } ] }
    const data = await net.resolveHost('171.121.41.202')
    console.log(data)

    // 2.检查网络连接
    console.log('Is online:', net.isOnline())

    // 3.fetch发起请求
    // const response = await net.fetch(
    //   'https://gateway.qidian.qq.com/v1/interface/inner/cloudim_324034'
    // )
    // console.log(response)

    // 4.request发起请求
    const request = net.request('https://gateway.qidian.qq.com/v1/interface/inner/cloudim_324034')
    request.on('response', (response) => {
      console.log(`STATUS: ${response.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
      response.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`)
      })
      response.on('end', () => {
        console.log('No more data in response.')
      })
    })
    request.end()

    return 'send-request'
  })
}

// powerMonitor相关
async function setupPowerMonitorHandler(): Promise<void> {
  ipcMain.handle('power-monitor', async (_e, options): Promise<boolean> => {
    console.log('power-monitor', options)
    const data = powerMonitor.isOnBatteryPower()

    return data
  })
}

// 应用内购买
async function setupPurchaseProductHandler(): Promise<void> {
  ipcMain.handle('purchase-product', async () => {
    // 检查用户是否可以进行支付
    // if (!inAppPurchase.canMakePayments()) {
    //   console.log('用户无法进行支付')
    // }
    // // 获取商品信息
    // inAppPurchase.getProducts(PRODUCT_IDS).then((products) => {
    //   products.forEach((product) => {
    //     console.log(`商品名称: ${product.localizedTitle}, 价格: ${product.formattedPrice}`)
    //   })
    //   // 发起购买请求
    //   inAppPurchase.purchaseProduct(products[0].productIdentifier).then((isProductValid) => {
    //     if (!isProductValid) {
    //       console.log('商品无效')
    //     } else {
    //       console.log('支付已添加到支付队列')
    //     }
    //   })
    // })
    // const win = new BaseWindow({ width: 800, height: 600 })
    // const leftView = new WebContentsView()
    // leftView.webContents.loadURL('https://electronjs.org')
    // win.contentView.addChildView(leftView)
    // const rightView = new WebContentsView()
    // rightView.webContents.loadURL('https://baidu.com')
    // win.contentView.addChildView(rightView)
    // leftView.setBounds({ x: 0, y: 0, width: 400, height: 600 })
    // rightView.setBounds({ x: 400, y: 0, width: 400, height: 600 })
    // const parent = new BaseWindow()
    // const child = new BaseWindow({ parent })
    // const parent = new BaseWindow()
    // const child = new BaseWindow({ parent, modal: true })
  })
}

// 自动更新
async function setupAutoUpdateHandler(): Promise<void> {
  ipcMain.handle('auto-update', async () => {
    autoUpdateInit()
  })
}

// 版本获取
async function setupGetVersionHandler(): Promise<void> {
  ipcMain.handle('get-version', async () => {
    // 获取当前应用版本号
    return app.getVersion()
  })
}

// 注册所有IPC处理器
export function registerIPCEvents(windowInstance: BrowserWindow): BrowserWindow {
  setupSetWindowSizeHandler(windowInstance) // 设置窗口尺寸
  setupSetWindowPositionHandler(windowInstance) // 设置窗口位置
  setupMaximizeWindowHandler(windowInstance) // 设置窗口最大化
  setupMinimizeWindowHandler(windowInstance) // 设置窗口最小化
  setupUnmaximizeWindowHandler(windowInstance) // 设置窗口恢复
  setupCloseWindowHandler(windowInstance) // 设置窗口关闭
  setupToggleFullScreenHandler(windowInstance) // 设置窗口全屏
  setupAlwaysOnTopHandler(windowInstance) // 设置窗口始终在最前端
  setupWindowOpacityHandler(windowInstance) // 设置窗口透明度
  setupFocusWindowHandler(windowInstance) // 设置窗口聚焦
  setupPastePicHandler() // 获取剪切板中的图片
  setupGetAvailableScreensHandler() // 获取所有可显示的屏幕和窗口信息
  setupCaptureStreamHandler() // 获取所选屏幕或窗口的id的视频流
  setupShowDialogHandler(windowInstance) // 显示系统对话框dialog
  setupCreateMenuHandler(windowInstance) // 创建菜单
  setupShowNotificationHandler() // 显示系统提示
  setupSendRequestHandler() // 发送请求
  setupPowerMonitorHandler() // powerMonitor相关
  setupPurchaseProductHandler() // 应用内购买
  setupAutoUpdateHandler() //自动更新
  setupGetVersionHandler() // 获取应用版本号
  return windowInstance
}
