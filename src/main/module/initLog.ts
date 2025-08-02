import { is } from '@electron-toolkit/utils'
import * as log from 'electron-log'
import * as fs from 'fs'
import * as path from 'path'
import { config } from './config'
export const initlog = (): void => {
  log.initialize()
  log.transports.file.resolvePathFn = () => {
    let mainlogPath = ''
    if (is.dev) {
      const logPath = config.dev.log.logDir
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true })
      }
      mainlogPath = path.join(logPath, config.dev.log.logName)
    }
    return mainlogPath
  }
}
