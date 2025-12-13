import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

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
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  )
}
