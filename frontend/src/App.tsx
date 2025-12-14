import { Outlet, Link } from 'react-router-dom'

export default function App() {
  const token = localStorage.getItem('token')

  return (
    <div>
      {/* Top Frame */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-pink-600">🍭 Sweet Shop</h1>

          <div className="flex gap-6 items-center">
            <Link className="hover:text-pink-500 font-medium" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-pink-500 font-medium" to="/admin">Admin</Link>

            {token ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/login'
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Content Frame */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}