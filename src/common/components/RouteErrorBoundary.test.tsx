import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RouteErrorBoundary } from './RouteErrorBoundary'

function renderError(error: unknown) {
  const router = createMemoryRouter([
    { path: '/', element: <div />, errorElement: <RouteErrorBoundary />, loader: () => { throw error } },
  ])
  render(<RouterProvider router={router} />)
}

describe('RouteErrorBoundary', () => {
  it('일반 Error 메시지를 표시한다', async () => {
    renderError(new Error('데이터를 불러오지 못했습니다.'))
    expect(await screen.findByRole('alert')).toHaveTextContent('데이터를 불러오지 못했습니다.')
  })

  it('404 응답에는 페이지 없음 메시지를 표시한다', async () => {
    renderError(new Response('없음', { status: 404 }))
    expect(await screen.findByRole('alert')).toHaveTextContent('페이지를 찾을 수 없습니다.')
  })
})
