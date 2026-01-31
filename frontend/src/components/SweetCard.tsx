import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function SweetCard({ sweet, onPurchase }: any) {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function buy() {
    if (sweet.quantity === 0) return
    setBusy(true)
    try {
      await onPurchase(sweet.id)
      setDone(true)
      setTimeout(()=> setDone(false), 1500)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-2xl bg-white/90 dark:bg-slate-800 p-5 shadow hover:shadow-2xl border border-gray-100 dark:border-slate-700 transition">

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-500 to-accent-300 flex items-center justify-center text-white font-bold text-lg">
          {sweet.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{sweet.name}</h3>
            <span className="text-xs px-3 py-1 rounded-full bg-pinks-50 text-pinks-500 dark:bg-pinks-900 dark:text-pinks-300">{sweet.category}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Stock: {sweet.quantity}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-2xl font-bold text-brand-600">₹{sweet.price}</div>
        </div>

        <div className="w-36">
          <motion.button whileTap={{ scale: 0.96 }} onClick={buy} disabled={busy || sweet.quantity === 0} className={`w-full py-2 rounded-xl text-white font-semibold transition ${sweet.quantity === 0 ? 'bg-gray-400 cursor-not-allowed' : 'btn-glow'}`}>
            {busy ? 'Processing...' : done ? '✓ Added' : (sweet.quantity === 0 ? 'Out' : 'Buy')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
