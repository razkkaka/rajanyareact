import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiHeart, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (user) checkFavorite()
  }, [user, id])

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      } else {
        navigate('/menu')
      }
    } catch (error) {
      toast.error('Gagal memuat produk')
      navigate('/menu')
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    try {
      const res = await fetch(`/api/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setIsFavorited(data.isFavorited)
    } catch (error) {
      console.error('Error checking favorite', error)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      navigate('/login')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity }),
      })
      const data = await res.json()
      if (res.ok) toast.success('Ditambahkan ke keranjang')
      else toast.error(data.error)
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return
    }

    try {
      const res = await fetch(`/api/favorites/toggle/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setIsFavorited(data.isFavorited)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat produk...</div>
  }

  if (!product) return null

  const gradient = product.category === 'coffee' ? 'from-coffee-800 to-coffee-600' : 'from-emerald-600 to-lime-500'

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-coffee-700 hover:text-coffee-900">
        <FiArrowLeft /> Kembali
      </button>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
        <div className={`rounded-[2rem] bg-gradient-to-br ${gradient} min-h-[320px] p-6 flex items-end text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.24em] text-white/80">{product.category === 'coffee' ? 'Kopi' : 'Non-Kopi'}</p>
            <p className="mt-3 font-display text-4xl font-bold">{product.name}</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-coffee-100 px-3 py-1 text-xs font-semibold text-coffee-700">{product.category === 'coffee' ? 'Kopi' : 'Non-Kopi'}</span>
            <button onClick={handleToggleFavorite} className={`p-2 rounded-full ${isFavorited ? 'bg-red-100 text-red-500' : 'bg-cream-100 text-coffee-700'}`}>
              <FiHeart className={isFavorited ? 'fill-current' : ''} />
            </button>
          </div>

          <h1 className="mt-4 section-title">{product.name}</h1>
          <p className="mt-3 text-coffee-700 text-lg">{product.description}</p>
          <p className="mt-6 text-4xl font-bold text-coffee-900">{formatPrice(product.price)}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium text-coffee-700">Jumlah</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-2 rounded-lg bg-cream-100 text-coffee-700"><FiMinus /></button>
              <span className="min-w-8 text-center font-semibold text-coffee-900">{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)} className="p-2 rounded-lg bg-cream-100 text-coffee-700"><FiPlus /></button>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              <FiShoppingCart /> Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
