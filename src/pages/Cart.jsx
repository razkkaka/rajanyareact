import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiShoppingBag } from 'react-icons/fi'
import CartItem from '../components/CartItem'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setCartItems(data)
    } catch (error) {
      toast.error('Gagal memuat keranjang')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })
      if (res.ok) {
        setCartItems((items) => items.map((item) => item.id === id ? { ...item, quantity } : item))
      }
    } catch (error) {
      toast.error('Gagal mengupdate keranjang')
    }
  }

  const removeItem = async (id) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setCartItems((items) => items.filter((item) => item.id !== id))
        toast.success('Produk dihapus dari keranjang')
      }
    } catch (error) {
      toast.error('Gagal menghapus produk')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat keranjang...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Keranjang</p>
          <h1 className="mt-2 section-title">Keranjang Belanja</h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="card p-10 text-center">
          <FiShoppingBag className="mx-auto text-4xl text-coffee-500" />
          <p className="mt-4 text-xl font-semibold text-coffee-900">Keranjang Anda Kosong</p>
          <p className="mt-2 text-coffee-700">Yuk, mulai pesan minuman favoritmu sekarang.</p>
          <Link to="/menu" className="btn-primary mt-5">Lihat Menu</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}
          </div>

          <aside className="card p-6 h-fit">
            <h2 className="text-xl font-semibold text-coffee-900">Ringkasan Pesanan</h2>
            <div className="mt-4 space-y-3 text-sm text-coffee-700">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
              <div className="flex justify-between"><span>Biaya layanan</span><span>Gratis</span></div>
              <div className="border-t border-cream-200 pt-3 flex justify-between text-base font-bold text-coffee-900"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6">Checkout</button>
          </aside>
        </div>
      )}
    </div>
  )
}
