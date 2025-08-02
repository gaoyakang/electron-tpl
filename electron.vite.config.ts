import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs'

// 开发状态下将resources目录下的文件复制到out目录下
fs.cpSync(resolve(__dirname, 'resources'), resolve(__dirname, 'out/resources'), {
  recursive: true
})

// https://cn.vitejs.dev/config/build-options
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/mainwin.html'),
          settings: resolve(__dirname, 'src/renderer/settingwin.html')
        }
      }
    }
  }
})
