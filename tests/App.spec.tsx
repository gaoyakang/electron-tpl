import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/renderer/src/App'

describe('App', () => {
  it('should render', () => {
    render(<App />)
    // 检查整体结构
    const divElement = screen.getByTestId('app-wrapper')

    // 获取其内部文本
    expect(divElement.textContent).toBe('hello world')
    expect(divElement).toHaveTextContent('hello world')
  })
})
