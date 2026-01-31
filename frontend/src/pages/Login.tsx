import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate, Link } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'
import FormField from '../components/FormField'

export default function Login(){
  const [email,setEmail]=useState('user@example.com')
  const [password,setPassword]=useState('userpass')
  const nav = useNavigate()
  const [err,setErr]=useState('')
  async function submit(e:React.FormEvent){
    e.preventDefault()
    try{
      const res = await api.post('/auth/login',{ email, password })
      localStorage.setItem('token', res.data.token)
      nav('/dashboard')
    }catch(err:any){
      setErr(err?.response?.data?.error||'Login failed')
    }
  }
  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to continue to Sweet Shop</p>

      <form onSubmit={submit} aria-label="Login form">
        <FormField label="Email" id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
        <FormField label="Password" id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" />

        {err && <p className="error">{err}</p>}

        <div className="mt-4 flex items-center justify-between">
          <Link to="/register" className="text-sm text-gray-600 hover:text-gray-800">Create account</Link>
          <PrimaryButton type="submit">Sign in</PrimaryButton>
        </div>
      </form>
    </div>
  )
}
