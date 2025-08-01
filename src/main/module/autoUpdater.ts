import { app, BrowserWindow, dialog } from 'electron'
import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'
import { exec } from 'child_process'
import semver from 'semver'

export function autoUpdateInit(): void {
  console.log('enter autoUpdateInit...')
  // 因为要求服务器一直开着后续才不会报错，所以这里先注释掉
  // checkForUpdates()
}

// 检查更新
function checkForUpdates(): void {
  const currentVersion = app.getVersion()
  const updateUrl = 'http://localhost:3000/darwin?version=' + currentVersion

  http
    .get(updateUrl, (res) => {
      if (res.statusCode === 204) {
        console.log('没有新版本')
        return
      }

      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        const updateInfo = JSON.parse(data)
        if (semver.gt(updateInfo.name, currentVersion)) {
          const windowInstance = BrowserWindow.getAllWindows()[0]
          // 有更新
          dialog
            .showMessageBox(windowInstance, {
              type: 'info',
              title: '更新可用',
              message: `发现新版本 ${updateInfo.name}，当前版本 ${currentVersion}。是否立即更新？`,
              buttons: ['是', '否']
            })
            .then((result) => {
              if (result.response === 0) {
                // 用户选择更新
                downloadUpdate(updateInfo.url)
              }
            })
        } else {
          console.log('没有新版本')
        }
      })
    })
    .on('error', (err) => {
      console.error('检查更新失败', err)
    })
}

// 下载更新
function downloadUpdate(updateUrl): void {
  const filePath = path.join(app.getPath('downloads'), 'electron-app-update.zip')
  const file = fs.createWriteStream(filePath)
  const request = http.get(updateUrl, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      installUpdate(filePath)
    })
  })

  request.on('error', (err) => {
    fs.unlink(filePath, () => {
      console.error('下载失败', err)
    })
  })
}

// 安装更新
function installUpdate(filePath): void {
  const windowInstance = BrowserWindow.getAllWindows()[0]
  dialog
    .showMessageBox(windowInstance, {
      type: 'info',
      title: '更新完成',
      message: '更新文件已下载完成，即将开始安装。',
      buttons: ['确定']
    })
    .then(() => {
      // 在 macOS 上，打开 DMG 文件并安装
      if (process.platform === 'darwin') {
        exec(`open "${filePath}"`, (err) => {
          if (err) {
            console.error('打开 DMG 文件失败', err)
            return
          }
          console.log('安装程序已启动')
        })
      } else if (process.platform === 'win32') {
        // 在 Windows 上，运行安装程序
        exec(`"${filePath}" /S`, (err) => {
          if (err) {
            console.error('安装失败', err)
            return
          }
          console.log('安装程序已启动')
        })
      } else if (process.platform === 'linux') {
        // 在 Linux 上，运行安装脚本
        exec(`sudo dpkg -i "${filePath}"`, (err) => {
          if (err) {
            console.error('安装失败', err)
            return
          }
          console.log('安装程序已启动')
        })
      }

      // 重启应用
      app.quit()
    })
}
