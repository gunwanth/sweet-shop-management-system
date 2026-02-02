import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSweet, setSelectedSweet] = useState<any | null>(null)
  const [showStats, setShowStats] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)

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
      setSelectedSweet(null)
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Purchase failed')
    }
  }

  useEffect(() => {
    search()
  }, [])

  const stats = useMemo(() => {
    const totalItems = sweets.length
    const totalStock = sweets.reduce((s, i) => s + (i.quantity || 0), 0)
    const lowStock = sweets.filter(s => s.quantity <= 3).length
    const totalValue = sweets.reduce((s, i) => s + (i.quantity || 0) * (i.price || 0), 0)
    return { totalItems, totalStock, lowStock, totalValue }
  }, [sweets])

  const salesData = useMemo(() => {
    const arr = Array.from({ length: 30 }).map((_, i) => Math.round(20 + Math.random() * 80))
    return arr
  }, [])

  const activities = useMemo(() => [
    { id: 1, title: 'New order placed: Chocolate Bliss', time: '2m ago', icon: '🧾' },
    { id: 2, title: 'Stock low: Strawberry Fizz', time: '1h ago', icon: '⚠️' },
    { id: 3, title: 'New sweet added: Mango Dream', time: '3h ago', icon: '➕' },
  ], [])

  const [sort, setSort] = useState<'popular'|'price'|'stock'>('popular')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const sortedSweets = useMemo(() => {
    let items = [...sweets]
    
    // Apply filters
    if (categoryFilter) {
      items = items.filter(s => s.category === categoryFilter)
    }
    items = items.filter(s => s.price >= priceRange[0] && s.price <= priceRange[1])
    
    // Apply sorting
    if (sort === 'price') items.sort((a,b)=>b.price-a.price)
    if (sort === 'stock') items.sort((a,b)=>b.quantity-a.quantity)
    return items
  }, [sweets, sort, categoryFilter, priceRange])

  const categories = useMemo(() => {
    const cats = new Set(sweets.map(s => s.category).filter(Boolean))
    return Array.from(cats)
  }, [sweets])

  return (
    <Layout title="Available Sweets">
      {/* Top Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border border-purple-100 dark:border-slate-600 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">View Mode:</span>
            <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">⊞</span> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-purple-500 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">☰</span> List
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle Switches */}
            <ToggleSwitch label="Stats" checked={showStats} onChange={setShowStats} />
            <ToggleSwitch label="Compact" checked={compactMode} onChange={setCompactMode} />
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilters 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-600'
              }`}
            >
              <span className="mr-2">🔍</span>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {/* Expandable Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-slate-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Category</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Sort By</label>
                    <select 
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={sort} 
                      onChange={e=>setSort(e.target.value as any)}
                    >
                      <option value="popular">Most Popular</option>
                      <option value="price">Highest Price</option>
                      <option value="stock">Stock Level</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Hero Section with Gradient */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
            
            <div className="relative">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold mb-2"
              >
                Welcome back! 🍬
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
                className="text-purple-100 mb-6"
              >
                Explore popular sweets, discover new flavors, and buy instantly.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex-1 min-w-[200px]">
                  <input 
                    placeholder="🔍 Search by name..." 
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    onChange={e => setQuery({ ...query, name: e.target.value })} 
                  />
                </div>
                <PrimaryButton variant="glow" onClick={search}>
                  Search Now
                </PrimaryButton>
              </motion.div>

              {newArrivals.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.4 }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
                >
                  <span className="text-sm font-medium">✨ New:</span>
                  <span className="text-sm">{newArrivals[0]?.name}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Stats Cards */}
          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <StatCard title="Products" value={stats.totalItems} delta={6} sparkData={[3,4,5,6,5,4,6,8]} />
                <StatCard title="Total stock" value={stats.totalStock} delta={-2} sparkData={[10,8,9,8,6,6,7,9]} />
                <StatCard title="Low stock" value={stats.lowStock} delta={12} sparkData={[1,2,1,3,2,1,3,2]} />
                <StatCard title="Inventory value" value={`₹${stats.totalValue}`} delta={4} sparkData={[30,40,35,50,45,48,60,72]} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sweets Grid/List */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Available Sweets
                <span className="ml-2 text-sm font-normal text-gray-500">({sortedSweets.length} items)</span>
              </h3>
            </div>

            <div id="sweets-grid" className={
              viewMode === 'grid' 
                ? `grid grid-cols-1 ${compactMode ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`
                : 'space-y-3'
            }>
              {sortedSweets.map((s, i) => (
                <motion.div 
                  key={s.id} 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSweet(s)}
                  className="cursor-pointer"
                >
                  {viewMode === 'grid' ? (
                    <SweetCard sweet={s} onPurchase={purchase} />
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-800 border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                        🍬
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{s.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{s.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">₹{s.price}</div>
                        <div className="text-xs text-gray-500">Stock: {s.quantity}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          purchase(s.id)
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                      >
                        Buy
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: side widgets */}
        <aside className="space-y-6">
          <SalesChart data={salesData} />
          <ActivityFeed activities={activities} />

          {/* New Arrivals - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 shadow-lg border border-amber-100 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span className="text-lg">✨</span>
                New Arrivals
              </h3>
              <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs font-semibold">
                {newArrivals.length}
              </span>
            </div>
            <ul className="space-y-2">
              {newArrivals.length === 0 && (
                <li className="text-sm text-gray-500 text-center py-4">No new arrivals yet</li>
              )}
              {newArrivals.slice(0,5).map((s:any, idx:number) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all border border-amber-100 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                      🍭
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.category || 'Sweet'}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-full text-xs font-semibold">
                    NEW
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Top Sellers - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 shadow-lg border border-blue-100 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span className="text-lg">🏆</span>
                Top Sellers
              </h3>
            </div>
            <ul className="space-y-2">
              {sweets.slice(0,5).map((s, idx) => (
                <motion.li 
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all border border-blue-100 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-xs font-bold text-white">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{s.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{s.category}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-purple-600">₹{s.price}</div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </aside>
      </div>

      {/* Interactive Sweet Detail Modal */}
      <AnimatePresence>
        {selectedSweet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSweet(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
                <div className="text-8xl">🍬</div>
                <button
                  onClick={() => setSelectedSweet(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {selectedSweet.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{selectedSweet.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">₹{selectedSweet.price}</div>
                    <div className="text-sm text-gray-500 mt-1">Stock: {selectedSweet.quantity} units</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-slate-700 text-center">
                    <div className="text-2xl mb-1">⭐</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Rating</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">4.8/5</div>
                  </div>
                  <div className="p-4 rounded-xl bg-pink-50 dark:bg-slate-700 text-center">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Popularity</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">High</div>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-slate-700 text-center">
                    <div className="text-2xl mb-1">📦</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Available</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">In Stock</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => purchase(selectedSweet.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Purchase Now
                  </button>
                  <button
                    onClick={() => setSelectedSweet(null)}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

// Toggle Switch Component
function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-500' : 'bg-gray-300 dark:bg-slate-600'
        }`}
      >
        <motion.div
          initial={false}
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </button>
    </div>
  )
}