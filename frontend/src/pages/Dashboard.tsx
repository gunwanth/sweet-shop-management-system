import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/api'
import SweetCard from '../components/SweetCard'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import SalesChart from '../components/SalesChart'
import ActivityFeed from '../components/ActivityFeed'
import PrimaryButton from '../components/PrimaryButton'

export default function Dashboard() {
  const [sweets, setSweets] = useState<any[]>([])
  const [query, setQuery] = useState({ name: '', category: '' })
  const [newArrivals, setNewArrivals] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('newSweets') || '[]') } catch { return [] }
  })

  useEffect(() => {
    function onCreated(e: any) {
      const created = e?.detail
      if (!created) return
      setNewArrivals(prev => {
        const nxt = [created, ...prev].slice(0, 10)
        try { localStorage.setItem('newSweets', JSON.stringify(nxt)) } catch {}
        return nxt
      })
    }

    window.addEventListener('sweet:created', onCreated)
    return () => window.removeEventListener('sweet:created', onCreated)
  }, [])

  async function search() {
    const res = await api.get('/sweets/search', { params: query })
    setSweets(res.data)
  }

  async function purchase(id: string) {
    try {
      await api.post(`/sweets/${id}/purchase`, { quantity: 1 })
      search()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Purchase failed')
    }
  }

  useEffect(() => {
    search()
  }, [])

  // debounce search when query changes
  useEffect(() => {
    const t = setTimeout(() => {
      search()
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  const stats = useMemo(() => {
    const totalItems = sweets.length
    const totalStock = sweets.reduce((s, i) => s + (i.quantity || 0), 0)
    const lowStock = sweets.filter(s => s.quantity <= 3).length
    const totalValue = sweets.reduce((s, i) => s + (i.quantity || 0) * (i.price || 0), 0)
    return { totalItems, totalStock, lowStock, totalValue }
  }, [sweets])

  // Mock sales data for chart (could be replaced with real API data)
  const salesData = useMemo(() => {
    const arr = Array.from({ length: 30 }).map((_, i) => Math.round(20 + Math.random() * 80))
    return arr
  }, [])

  const activities = useMemo(() => [
    { id: 1, title: 'New order placed: Chocolate Bliss', time: '2m ago', icon: '🧾' },
    { id: 2, title: 'Stock low: Strawberry Fizz', time: '1h ago', icon: '⚠️' },
    { id: 3, title: 'New sweet added: Mango Dream', time: '3h ago', icon: '➕' },
  ], [])

  // interactive filters
  const [sort, setSort] = useState<'popular'|'price'|'stock'>('popular')

  const sortedSweets = useMemo(() => {
    const items = [...sweets]
    if (sort === 'price') items.sort((a,b)=>b.price-a.price)
    if (sort === 'stock') items.sort((a,b)=>b.quantity-a.quantity)
    return items
  }, [sweets, sort])

  return (
    <Layout title="Available Sweets">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: main content */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl p-6 bg-white dark:bg-slate-800 shadow mb-6">
            <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Welcome back 🍬</motion.h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">Explore popular sweets, discover new flavors, and buy instantly.</p>

            <div className="hero-band mb-4 flex items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-200 font-medium">New: <span className="ml-2 text-brand-600 dark:text-brand-400">{newArrivals?.[0]?.name || '—'}</span></div>
              <div className="ml-4 space-x-2 flex items-center">
                <PrimaryButton variant="glow" onClick={()=>{ document.getElementById('sweets-grid')?.scrollIntoView({behavior:'smooth'}) }}>Explore</PrimaryButton>
                <button onClick={()=>{ document.getElementById('new-arrivals')?.scrollIntoView({behavior:'smooth'}) }} className="text-sm text-gray-600 dark:text-gray-300">See all</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input placeholder="Search by Name" className="flex-1 input" onChange={e => setQuery({ ...query, name: e.target.value })} />

              <select className="input w-40" value={sort} onChange={e=>setSort(e.target.value as any)}>
                <option value="popular">Most Popular</option>
                <option value="price">Highest Price</option>
                <option value="stock">Stock</option>
              </select>

              <PrimaryButton variant="glow" onClick={search}>Search</PrimaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <StatCard title="Products" value={stats.totalItems} delta={6} sparkData={[3,4,5,6,5,4,6,8]} />
            <StatCard title="Total stock" value={stats.totalStock} delta={-2} sparkData={[10,8,9,8,6,6,7,9]} />
            <StatCard title="Low stock" value={stats.lowStock} delta={12} sparkData={[1,2,1,3,2,1,3,2]} />
            <StatCard title="Inventory value" value={`₹${stats.totalValue}`} delta={4} sparkData={[30,40,35,50,45,48,60,72]} />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Sweets</h3>

              <div id="sweets-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedSweets.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <SweetCard sweet={s} onPurchase={purchase} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: side widgets */}
        <aside className="space-y-6">
          <SalesChart data={salesData} />
          <ActivityFeed activities={activities} />

          <div id="new-arrivals" className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow section">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">New Arrivals</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 new-list">
              {newArrivals.length === 0 && <li className="text-gray-500">No new arrivals</li>}
              {newArrivals.slice(0,5).map((s:any, idx:number) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{s.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.category || ''}</div>
                  </div>
                  <div className="text-xs text-gray-500"><span className="new-badge">New</span></div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Top Sellers</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              {sweets.slice(0,5).map(s => (
                <li key={s.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{s.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{s.category}</div>
                  </div>
                  <div className="text-sm font-semibold text-brand-600">₹{s.price}</div>
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </div>
    </Layout>
  )
}