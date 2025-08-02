import { is } from '@electron-toolkit/utils'
import * as log from 'electron-log'
import * as fs from 'fs'
import * as path from 'path'
export const initlog = (): void => {
  log.initialize()
  log.transports.file.resolvePathFn = () => {
    let mainlogPath = ''
    if (is.dev) {
      const logPath = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath, { recursive: true })
      }
      mainlogPath = path.join(logPath, 'main.log')
    }
    return mainlogPath
  }
}
