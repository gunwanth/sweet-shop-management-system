import React from 'react'

export default function PrimaryButton({ children, ...props }: any) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 active:scale-95 transition"
    >
      {children}
    </button>
  )
}