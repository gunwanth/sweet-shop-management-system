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
    <motion.div whileHover={{ y: -6 }} className="sweet-card hover:shadow-2xl transition">
      <div className="flex items-start gap-4">
        <div className="sweet-icon bg-gradient-to-br from-purple-400 to-pink-400">{sweet.icon || sweet.name[0]}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{sweet.name}</h3>
            <div className="text-sm font-bold text-gray-700">₹{sweet.price}</div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{sweet.category} • <span className="font-medium">{sweet.quantity}</span> left</p>
        </div>
      </div>

      <div className="mt-4">
        <motion.button whileTap={{ scale: 0.96 }} onClick={buy} disabled={busy || sweet.quantity === 0} className={`w-full buy-btn ${sweet.quantity === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}>
          {busy ? 'Processing...' : done ? '✓ Added' : (sweet.quantity === 0 ? 'Out of stock' : 'Buy Now')}
        </motion.button>
      </div>
    </motion.div>
  )
}
