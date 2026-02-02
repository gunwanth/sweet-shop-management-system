import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'
import FormField from '../components/FormField'

export default function Register(){
  const [email,setEmail]=useState('')
  const [name,setName]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()
  const [err,setErr]=useState('')
  async function submit(e:React.FormEvent){
    e.preventDefault()
    try{
      await api.post('/auth/register',{ name, email, password })
      nav('/login')
    }catch(err:any){
      setErr(err?.response?.data?.error||'Registration failed')
    }
  }
  return (
    <div className="card rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h2>
        <p className="text-sm text-gray-500 mb-6">Register a new account to manage sweets and orders</p>
      </div>

      <form onSubmit={submit} aria-label="Register form">
        <FormField label="Name" id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" autoComplete="name" />
        <FormField label="Email" id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
        <FormField label="Password" id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" />

        {err && <p className="error">{err}</p>}

        <div className="mt-4 flex items-center justify-end">
          <PrimaryButton type="submit">Create account</PrimaryButton>
        </div>
      </form>
    </div>
  )
}
