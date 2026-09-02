import {index, route, type RouteConfig} from '@react-router/dev/routes'

export default [
  index('./routes/home.tsx'),
  route('csr', './features/csr/CsrPage.tsx'),
  route('csr/:id/comments', './features/csr/CsrCommentsPage.tsx'),
  route('csr/:id', './features/csr/CsrDetailPage.tsx'),
  route('ssr', './features/ssr/SsrPage.tsx'),
  route('ssr/:id/comments', './features/ssr/SsrCommentsPage.tsx'),
  route('ssr/:id', './features/ssr/SsrDetailPage.tsx'),
] satisfies RouteConfig
