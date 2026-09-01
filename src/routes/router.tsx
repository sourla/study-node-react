import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import { RouteErrorBoundary } from '../common/components/RouteErrorBoundary'
import { CsrPage } from '../features/csr/CsrPage'
import { CsrDetailPage } from '../features/csr/CsrDetailPage'
import { SsrPage } from '../features/ssr/SsrPage'
import { ssrLoader } from '../features/ssr/ssrLoader'
import { SsrDetailPage, ssrDetailLoader } from '../features/ssr/SsrDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <CsrPage /> },
      { path: 'csr', element: <CsrPage /> },
      { path: 'csr/:id', element: <CsrDetailPage /> },
      { path: 'ssr', loader: ssrLoader, element: <SsrPage /> },
      { path: 'ssr/:id', loader: ssrDetailLoader, element: <SsrDetailPage /> },
    ],
  },
])
