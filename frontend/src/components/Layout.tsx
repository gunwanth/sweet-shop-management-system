import React from 'react'
import Header from './Header'

export default function Layout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="app-bg min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container">
        <Header />
        {title && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  )
}
