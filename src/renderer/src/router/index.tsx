import App from '@renderer/App'
import { createBrowserRouter } from 'react-router-dom' // 注意：react-router → react-router-dom
const routes = [
  {
    path: '/',
    element: <App />
  }
]
export const router = createBrowserRouter(routes)
