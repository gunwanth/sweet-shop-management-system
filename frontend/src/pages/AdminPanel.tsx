import React, { useEffect, useState } from 'react'
import api from '../api/api'

export default function AdminPanel(){
  const [sweets,setSweets]=useState<any[]>([])
  const [form,setForm]=useState({name:'',category:'',price:'',quantity:''})
  useEffect(()=>{ fetchAll() },[])
  async function fetchAll(){
    const res = await api.get('/sweets')
    setSweets(res.data)
  }
  async function submit(e:React.FormEvent){
    e.preventDefault()
    await api.post('/sweets',{ name: form.name, category: form.category, price: parseFloat(form.price), quantity: parseInt(form.quantity,10) })
    setForm({name:'',category:'',price:'',quantity:''})
    fetchAll()
  }
  async function del(id:string){
    if (!confirm('Delete?')) return
    await api.delete(`/sweets/${id}`)
    fetchAll()
  }
  async function restock(id:string){
    const qty = parseInt(prompt('Quantity to add','10')||'0',10)
    if (!qty) return
    await api.post(`/sweets/${id}/restock`, { quantity: qty })
    fetchAll()
  }
  return (
    <div>
      <h2>Admin Panel</h2>
      <form onSubmit={submit} className="card">
        <label>Name</label>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <label>Category</label>
        <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
        <label>Price</label>
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <label>Quantity</label>
        <input value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
        <button type="submit">Add Sweet</button>
      </form>

      <div className="grid">
        {sweets.map(s => (
          <div key={s.id} className="card">
            <h3>{s.name}</h3>
            <p>Price: ${s.price} · In stock: {s.quantity}</p>
            <button onClick={()=>restock(s.id)}>Restock</button>
            <button onClick={()=>del(s.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
