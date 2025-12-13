import React, { useEffect, useState } from 'react'
import api from '../api/api'
import SweetCard from '../components/SweetCard'

export default function Dashboard() {
  const [sweets, setSweets] = useState<any[]>([])
  const [err, setErr] = useState('')

  const [search, setSearch] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    try {
      const res = await api.get('/sweets')
      setSweets(res.data)
    } catch (err: any) {
      setErr(err?.response?.data?.error || 'Failed to load')
    }
  }

  async function doSearch(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()
    if (search.name) params.append("name", search.name)
    if (search.category) params.append("category", search.category)
    if (search.minPrice) params.append("minPrice", search.minPrice)
    if (search.maxPrice) params.append("maxPrice", search.maxPrice)

    try {
      const res = await api.get(`/sweets/search?${params.toString()}`)
      setSweets(res.data)
    } catch {
      setErr("Search failed")
    }
  }

  async function purchase(id: string) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: 1 })
      fetchAll()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Purchase failed')
    }
  }

  return (
    <div>
      <h2>Available Sweets</h2>
      {err && <p className="error">{err}</p>}

      {/* 🔍 SEARCH FORM */}
      <form onSubmit={doSearch} className="card" style={{ marginBottom: 20 }}>
        <h3>Search Sweets</h3>

        <label>Name</label>
        <input
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />

        <label>Category</label>
        <input
          value={search.category}
          onChange={(e) => setSearch({ ...search, category: e.target.value })}
        />

        <label>Min Price</label>
        <input
          type="number"
          value={search.minPrice}
          onChange={(e) => setSearch({ ...search, minPrice: e.target.value })}
        />

        <label>Max Price</label>
        <input
          type="number"
          value={search.maxPrice}
          onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })}
        />

        <button type="submit">Search</button>
        <button type="button" onClick={fetchAll}>Reset</button>
      </form>

      {/* SWEETS GRID */}
      <div className="grid">
        {sweets.map(s => (
          <SweetCard key={s.id} sweet={s} onPurchase={purchase} />
        ))}
      </div>
    </div>
  )
}