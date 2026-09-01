import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { CsrPage } from './features/csr/CsrPage'
import { CsrDetailPage } from './features/csr/CsrDetailPage'
import { SsrPage } from './features/ssr/SsrPage'
import { ssrLoader } from './features/ssr/ssrLoader'
import { SsrDetailPage, ssrDetailLoader } from './features/ssr/SsrDetailPage'
const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, element: <CsrPage /> },
      { path: 'csr', element: <CsrPage /> },
      { path: 'csr/:id', element: <CsrDetailPage /> },
      { path: 'ssr', loader: ssrLoader, element: <SsrPage /> },
      { path: 'ssr/:id', loader: ssrDetailLoader, element: <SsrDetailPage /> },
    ],
  },
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
