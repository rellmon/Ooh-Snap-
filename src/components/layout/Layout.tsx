import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-pink-50 text-slate-900">
      <header className="px-6 py-4">
        <Link
          to="/"
          className="rounded-lg text-2xl font-extrabold tracking-tight text-pink-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
        >
          Ooh Snap!
        </Link>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="px-6 py-4 text-center text-sm text-slate-500">
        Made for friends, parties, and good memories.
      </footer>
    </div>
  )
}

export default Layout