import { Link, Outlet } from 'react-router-dom'
import { Layers3 } from 'lucide-react'
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-white/10 bg-zinc-950/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-white">
            <Layers3 className="text-violet-400" size={21} /> Render Lab
          </Link>
          <nav className="flex gap-1 rounded-lg bg-white/5 p-1 text-sm">
            <Link
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
              to="/csr"
            >
              CSR
            </Link>
            <Link
              className="rounded-md px-3 py-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
              to="/ssr"
            >
              SSR
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Outlet />
      </div>
    </div>
  )
}
