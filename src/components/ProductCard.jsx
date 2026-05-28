import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product, onFavoriteToggle, isFavorited }) {
  const { user, token } = useAuth()

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return
    }

    if (product.stock_status === 'out_of_stock') {
      toast.error('Produk sedang habis')
      return
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Ditambahkan ke keranjang')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return
    }

    if (onFavoriteToggle) onFavoriteToggle(product.id)
  }

  const fallbackGradient = product.category === 'coffee'
    ? 'from-coffee-700 via-coffee-600 to-amber-500'
    : 'from-emerald-600 via-lime-500 to-yellow-400'

  return (
    <Link to={`/product/${product.id}`} className="group card p-0 block">
      <div className={`relative h-44 bg-gradient-to-br ${fallbackGradient} flex items-end p-4 text-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.26),transparent_30%)]" />
        <div className="relative z-10 flex items-center justify-between w-full">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">{product.category === 'coffee' ? 'Kopi' : 'Non-Kopi'}</p>
            <p className="mt-1 font-display text-xl font-bold">{product.name}</p>
          </div>
          {product.stock_status === 'out_of_stock' && (
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase">Habis</span>
          )}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-coffee-700 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-coffee-900">{formatPrice(product.price)}</p>
            <p className="text-xs text-coffee-500">{product.stock_status === 'available' ? 'Tersedia' : 'Stok habis'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition ${isFavorited ? 'bg-red-100 text-red-500' : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'}`}
            >
              <FiHeart className={isFavorited ? 'fill-current' : ''} />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-coffee-700 text-white hover:bg-coffee-800"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
