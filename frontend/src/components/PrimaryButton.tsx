import React from 'react'
import { motion } from 'framer-motion'

export default function PrimaryButton({ children, className = '', variant = 'solid', ...props }: any) {
  const glow = variant === 'glow'
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ translateY: -2 }}
      {...props}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200 transition-transform ${glow ? 'btn-glow' : 'bg-brand-600 hover:brightness-95'} ${className}`}
    >
      {children}
    </motion.button>
  )
}