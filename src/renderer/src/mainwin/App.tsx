import { StepForwardOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as log from 'electron-log'
import { useState } from 'react'
import { db } from './utils/db'

function App(): React.JSX.Element {
  // 1.打开窗口示例
  const handleMainProcess = async (): Promise<void> => {
    log.info('点击了打开设置窗口')
    await window.api.setupCreateWindow({
      windowName: 'settingwin',
      width: 200,
      height: 200,
      modal: true
    })
  }

  // 2.数据库操作示例
  const [id, setId] = useState<number>(0)
  const handleMainAddProcess = async (): Promise<void> => {
    // 增
    const id = await db.insert('user', { name: 'tom', age: 18 })
    console.log('新增成功，id为：', id)
    setId(id as number)
  }
  const handleMainDeleteProcess = async (): Promise<void> => {
    // 删
    await db.delete('user', 'id = ?', [id])
  }
  const handleMainUpdateProcess = async (): Promise<void> => {
    // 改
    await db.update('user', { age: 20 }, 'id = ?', [id])
  }
  const handleMainQueryProcess = async (): Promise<void> => {
    // 查
    const user = await db.selectOne('user', 'id = ?', [id])
    console.log('查询结果：', user)
  }

  // 3.跨窗口通信示例
  const handleWin2WinProcess = async (): Promise<void> => {
    log.info('点击了打开设置窗口')
    const winId = await window.api.setupCreateWindow({
      windowName: 'settingwin',
      width: 200,
      height: 200,
      modal: false
    })
    // 询问新窗口是否准备好
    while (!(await window.api.isWindowReady(winId))) {
      await new Promise((res) => setTimeout(res, 100)) // 100 ms 轮询一次
    }
    // 发送跨窗口消息
    await window.api.win2win(winId, '来自主窗口的数据')
  }
  return (
    <div data-testid="app-wrapper">
      <div>
        <h3>打开窗口示例</h3>
        <Button type="primary" onClick={handleMainProcess}>
          打开设置窗口
        </Button>
        <StepForwardOutlined />
      </div>
      <div>
        <h3>数据库操作示例</h3>
        <Button type="primary" onClick={handleMainAddProcess}>
          新增
        </Button>
        <Button type="primary" onClick={handleMainDeleteProcess}>
          删除
        </Button>
        <Button type="primary" onClick={handleMainUpdateProcess}>
          修改
        </Button>
        <Button type="primary" onClick={handleMainQueryProcess}>
          查询
        </Button>
      </div>
      <div>
        <h3>跨窗口通信示例</h3>
        <Button type="primary" onClick={handleWin2WinProcess}>
          打开设置窗口
        </Button>
      </div>
    </div>
  )
}

export default App
