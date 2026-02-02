import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/api'
import Layout from '../components/Layout'

/* =========================
   REUSABLE UI COMPONENTS
========================= */

function SectionFrame({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-12">
      {title && (
        <h3 className="text-xl font-semibold mb-5 text-gray-700">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

function ActionButton({
  label,
  color,
  onClick,
}: {
  label: string
  color: 'green' | 'red' | 'pink'
  onClick?: () => void
}) {
  const colors: any = {
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
    pink: 'bg-pink-500 hover:bg-pink-600',
  }

  return (
    <motion.button whileTap={{ scale: 0.96 }} whileHover={{ y: -2 }} onClick={onClick} className={`px-4 py-2 rounded-xl text-white font-medium transition transform ${colors[color]} shadow-sm hover:shadow-md`}>
      {label}
    </motion.button>
  )
}

/* =========================
   ADMIN PANEL
========================= */

export default function AdminPanel() {
  const [sweets, setSweets] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  })
  const [loading, setLoading] = useState(true)
  const [addedName, setAddedName] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    const res = await api.get('/sweets')
    setSweets(res.data)
    setLoading(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await api.post('/sweets', {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    })

    const created = res?.data || { name: form.name, category: form.category }

    // persist to localStorage for front-end "New Arrivals"
    try {
      const arr = JSON.parse(localStorage.getItem('newSweets') || '[]')
      arr.unshift(created)
      if (arr.length > 10) arr.splice(10)
      localStorage.setItem('newSweets', JSON.stringify(arr))
    } catch {}

    // notify other parts of the app
    try {
      window.dispatchEvent(new CustomEvent('sweet:created', { detail: created }))
    } catch {}

    setAddedName(created.name)
    setTimeout(() => setAddedName(''), 3000)

    setForm({ name: '', category: '', price: '', quantity: '' })
    fetchAll()
  }

  async function del(id: string) {
    if (!confirm('Delete this sweet?')) return
    await api.delete(`/sweets/${id}`)
    fetchAll()
  }

  async function restock(id: string) {
    const qty = parseInt(prompt('Quantity to add', '10') || '0', 10)
    if (!qty) return
    await api.post(`/sweets/${id}/restock`, { quantity: qty })
    fetchAll()
  }

  return (
    <Layout title="Sweet Shop – Admin Panel">
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg relative overflow-hidden fade-in">
        <div className="absolute inset-0 pattern-bg opacity-10 pointer-events-none"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">🍬 Sweet Shop – Admin Panel</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage sweets, stock, and categories</p>
      </div>

      {/* ADD SWEET SECTION */}
      <SectionFrame title="➕ Add New Sweet">
        <form onSubmit={submit} className="max-w-md space-y-4">
          <input
            className="input"
            placeholder="Sweet Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            className="input"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            required
          />

          <ActionButton label="Add Sweet" color="pink" />
        </form>
        {addedName && <p className="text-sm text-green-500 mt-3">Added: {addedName}</p>}
      </SectionFrame>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading sweets...</p>
      )}

      {/* SWEETS GRID SECTION */}
      <SectionFrame title="📦 Manage Inventory">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sweets.map(s => (
            <div
              key={s.id}
              className="rounded-2xl border border-pink-100
                         bg-white shadow-lg p-6
                         hover:shadow-2xl hover:-translate-y-1
                         transition-all"
            >
              <h3 className="text-lg font-bold">{s.name}</h3>
              <p className="text-sm text-gray-500">{s.category}</p>

              <p className="mt-3 text-xl font-bold text-pink-600">
                ₹{s.price}
              </p>

              <p className="text-sm mt-1">
                Stock:{' '}
                <span className="font-semibold">{s.quantity}</span>
              </p>

              {s.quantity === 0 && (
                <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full
                                 bg-red-100 text-red-600">
                  Out of stock
                </span>
              )}

              {/* ACTION FRAME */}
              <div className="mt-6 p-3 rounded-xl bg-gray-50 flex gap-3">
                <ActionButton
                  label="Restock"
                  color="green"
                  onClick={() => restock(s.id)}
                />
                <ActionButton
                  label="Delete"
                  color="red"
                  onClick={() => del(s.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionFrame>
    </Layout>
  )
}