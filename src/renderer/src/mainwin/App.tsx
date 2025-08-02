import { StepForwardOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import * as log from 'electron-log'

function App(): React.JSX.Element {
  const handleMainProcess = async (): Promise<void> => {
    log.info('点击了打开设置窗口')
    await window.api.setupCreateWindow('settingwin')
  }

  return (
    <div data-testid="app-wrapper">
      <Button type="primary" onClick={handleMainProcess}>
        打开设置窗口
      </Button>
      <StepForwardOutlined />
    </div>
  )
}

export default App
