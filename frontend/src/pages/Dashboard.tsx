import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/api'
import SweetCard from '../components/SweetCard'

export default function Dashboard() {
  const [sweets, setSweets] = useState<any[]>([])
  const [query, setQuery] = useState({ name: '', category: '' })

  async function search() {
    const res = await api.get('/sweets/search', { params: query })
    setSweets(res.data)
  }

  async function purchase(id: string) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: 1 })
      search()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Purchase failed')
    }
  }

  useEffect(() => {
    search()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* 🎨 COLOR FRAME */}
      <div className="rounded-3xl p-8 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 shadow-xl">

        {/* Title Frame */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-8 text-pink-600 text-center"
        >
          🍬 Available Sweets
        </motion.h2>

        {/* 🔍 Search Frame */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Search Your Favourite Sweet
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Search by Name"
              className="flex-1 border px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-400"
              onChange={e => setQuery({ ...query, name: e.target.value })}
            />
            <input
              placeholder="Search by Category"
              className="flex-1 border px-4 py-2 rounded-xl focus:ring-2 focus:ring-pink-400"
              onChange={e => setQuery({ ...query, category: e.target.value })}
            />
            <button
              onClick={search}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500
                         text-white font-semibold hover:scale-105 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* 🧱 SWEETS GRID FRAME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sweets.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl
                         p-5 transition-all border border-pink-100"
            >
              <SweetCard sweet={s} onPurchase={purchase} />
            </motion.div>
          ))}
        </div>

        {/* ✨ SIGNUP FRAME */}
        {!localStorage.getItem('token') && (
          <div className="flex justify-center mt-12">
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <p className="text-lg mb-4 font-medium">
                Want to buy sweets faster? 🍭
              </p>
              <a
                href="/signup"
                className="inline-block px-6 py-3 rounded-xl
                           bg-gradient-to-r from-pink-500 to-rose-500
                           text-white font-semibold hover:scale-105 transition"
              >
                Create Account
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}