import { StepForwardOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect } from 'react'

function App(): React.JSX.Element {
  const handleMainProcess = async (): Promise<void> => {
    // await window.api.showNotification({ title: '标题' })
  }
  useEffect(() => {
    handleMainProcess()
  }, [])
  return (
    <div data-testid="app-wrapper">
      <Button type="primary">Button</Button>
      <StepForwardOutlined />
    </div>
  )
}

export default App
