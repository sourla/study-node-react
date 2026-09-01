import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? '페이지를 찾을 수 없습니다.'
      : error.data
    : error instanceof Error
      ? error.message
      : '알 수 없는 오류가 발생했습니다.'

  return (
    <main role="alert">
      <h1>오류가 발생했습니다.</h1>
      <p>{message}</p>
    </main>
  )
}
