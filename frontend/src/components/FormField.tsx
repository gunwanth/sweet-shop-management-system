import React from 'react'

type Props = {
  label?: string
  id?: string
  type?: string
  value?: string
  onChange?: (e: any) => void
  placeholder?: string
  error?: string
  autoComplete?: string
}

export default function FormField({ label, id, type = 'text', value, onChange, placeholder, error, autoComplete }: Props) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-200 focus:border-brand-500 transition"
      />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
