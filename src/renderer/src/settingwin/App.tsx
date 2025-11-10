import { useEffect } from 'react'

function App(): React.JSX.Element {
  const winId = new URLSearchParams(location.search).get('winId') as string
  const handleMainProcess = async (): Promise<void> => {
    // 通知主进程当前窗口内容已准备好
    console.log('delaywin已准备就绪')
    console.log('delaywin的winId=', winId)
    await window.api.signalWindowReady(winId)
    // 监听跨窗口消息
    await window.api.onCrossWindowMessage((data) => {
      console.log('delaywin收到的数据:', data)
    })
  }
  useEffect(() => {
    console.log('delaywin启动')
    handleMainProcess()
  }, [])
  return <div data-testid="app-wrapper">delaywin</div>
}

export default App
