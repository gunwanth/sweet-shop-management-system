import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('token')
    nav('/login')
  }

  return (
    <header className="w-full py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold text-gray-900 dark:text-gray-100">Sweet Shop</Link>
        <nav className="hidden sm:flex gap-3 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin" className="hover:underline">Admin</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button onClick={logout} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Logout</button>
      </div>
    </header>
  )
}
