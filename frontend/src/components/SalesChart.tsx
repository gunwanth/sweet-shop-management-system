import React from 'react'
import { motion } from 'framer-motion'

export default function SalesChart({ data = [] }: any) {
  // data: array of numbers
  if (!data || data.length === 0) return <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow">No data</div>

  const W = 600
  const H = 160
  const max = Math.max(...data)
  const min = Math.min(...data)

  const points = data.map((d: number, i: number) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d - min) / (max - min || 1)) * H
    return `${x},${y}`
  }).join(' ')

  const area = `M0,${H} L${points} L${W},${H}`

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow hover:shadow-2xl transition">
      <p className="text-sm text-gray-500 mb-2">Sales (last 30 days)</p>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="160">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <motion.path d={area} fill="url(#g)" className="dark:fill-slate-700" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <motion.polyline points={points} fill="none" stroke="#ef6f4b" strokeWidth={2.5} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1 }} />
      </svg>
    </div>
  )
}
