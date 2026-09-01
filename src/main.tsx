import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { CsrPage } from './features/csr/CsrPage'
import { SsrPage, ssrLoader } from './features/ssr/SsrPage'
const router = createBrowserRouter([{ path: '/', Component: App, children: [{ index: true, element: <CsrPage /> }, { path: 'csr', element: <CsrPage /> }, { path: 'ssr', loader: ssrLoader, element: <SsrPage /> }] }])
createRoot(document.getElementById('root')!).render(<StrictMode><RouterProvider router={router} /></StrictMode>)
