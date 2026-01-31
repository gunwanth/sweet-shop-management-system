import { Outlet, Link } from 'react-router-dom'

export default function App() {
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div>
      {/* Top Frame / Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* App Title */}
          <h1 className="text-2xl font-bold text-pink-600">🍭 Sweet Shop</h1>

          {/* Navigation */}
          <div className="flex gap-4 items-center">
            <Link
              to="/dashboard"
              className="hover:text-pink-500 font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/admin"
              className="hover:text-pink-500 font-medium"
            >
              Admin
            </Link>

            {!token && (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="px-4 py-2 border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition"
                >
                  Login
                </Link>

                {/* Signup */}
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Signup
                </Link>
              </>
            )}

            {token && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
              >
                Logout
              </button>
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