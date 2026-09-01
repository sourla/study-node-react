import type { ReactNode } from 'react'
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router-dom'
import './index.css'

export const links = () => [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export { default } from './App'
export { RouteErrorBoundary as ErrorBoundary } from './common/components/RouteErrorBoundary'
