import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

export default function Menu() {
  const [products, setProducts] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, token } = useAuth()

  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    fetchProducts()
  }, [category])

  useEffect(() => {
    if (user) fetchFavorites()
  }, [user])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = category === 'all' ? '/api/products' : `/api/products?category=${category}`
      const res = await fetch(url)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      toast.error('Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setFavorites(new Set(data.map((item) => item.product_id)))
    } catch (error) {
      console.error('Error fetching favorites', error)
    }
  }

  const handleFavoriteToggle = async (productId) => {
    try {
      const res = await fetch(`/api/favorites/toggle/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setFavorites((current) => {
          const next = new Set(current)
          if (data.isFavorited) next.add(productId)
          else next.delete(productId)
          return next
        })
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'coffee', label: 'Kopi' },
    { value: 'non-coffee', label: 'Non-Kopi' },
  ]

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Menu</p>
            <h1 className="mt-2 section-title">Menu Kami</h1>
            <p className="mt-2 text-coffee-700">Pilih favoritmu dari koleksi minuman premium dan snack cafestyle.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSearchParams(cat.value === 'all' ? {} : { category: cat.value })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${category === cat.value ? 'bg-coffee-700 text-white' : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="card p-10 text-center text-coffee-700">Memuat produk...</div>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-coffee-700">Belum ada produk tersedia.</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onFavoriteToggle={handleFavoriteToggle} isFavorited={favorites.has(product.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
