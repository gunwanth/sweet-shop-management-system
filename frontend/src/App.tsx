import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  const token = localStorage.getItem('token')
  return (
    <div>
      <nav className="nav">
        <Link to="/dashboard">Dashboard</Link>
        {token ? <a onClick={() => { localStorage.removeItem('token'); window.location.href='/login' }} style={{cursor:'pointer'}}>Logout</a> : <Link to="/login">Login</Link>}
        <Link to="/admin">Admin</Link>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
