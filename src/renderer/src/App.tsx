import { StepForwardOutlined } from '@ant-design/icons'
import { Button } from 'antd'

function App(): React.JSX.Element {
  return (
    <div data-testid="app-wrapper">
      <Button type="primary">Primary Button</Button>
      <StepForwardOutlined />
    </div>
  )
}

export default App
