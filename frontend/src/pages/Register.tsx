import React, { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

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
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Register</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  )
}
