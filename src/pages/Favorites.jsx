import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setFavorites(data)
    } catch (error) {
      toast.error('Gagal memuat favorit')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = async (productId) => {
    try {
      const res = await fetch(`/api/favorites/toggle/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setFavorites((items) => items.filter((item) => item.product_id !== productId))
        toast.success('Dihapus dari favorit')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat favorit...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Favorit</p>
        <h1 className="mt-2 section-title">Favorit Saya</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-xl font-semibold text-coffee-900">Belum Ada Favorit</p>
          <p className="mt-2 text-coffee-700">Simpan produk favoritmu untuk akses lebih cepat.</p>
          <Link to="/menu" className="btn-primary mt-5">Jelajahi Menu</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {favorites.map((item) => (
            <ProductCard key={item.id} product={item} isFavorited={true} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  )
}
