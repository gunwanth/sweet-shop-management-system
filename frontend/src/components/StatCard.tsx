import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ title, value, delta, sparkData = [] }: any) {
  const up = delta >= 0
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow flex items-center justify-between relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand-500 to-accent-300 rounded-tr-md rounded-br-md opacity-90" />

      <div className="ml-4">
        <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <div className="mt-1">
          <span className={`text-sm px-2 py-0.5 rounded-full ${up ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{up ? '▲' : '▼'} {Math.abs(delta)}%</span>
        </div>
      </div>

      <div className="w-24 h-10">
        <Sparkline data={sparkData} color={up ? '#16a34a' : '#ef4444'} />
      </div>
    </div>
  )
}

export function Sparkline({ data = [], color = '#6366f1' }: any) {
  if (!data || data.length === 0) return <div />
  const W = 96
  const H = 36
  const max = Math.max(...data)
  const min = Math.min(...data)
  const points = data.map((d: number, i: number) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((d - min) / (max - min || 1)) * H
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9 }}
      />
    </svg>
  )
}
