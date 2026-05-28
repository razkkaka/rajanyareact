import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [processing, setProcessing] = useState(false)
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
      if (data.length === 0) {
        toast.error('Keranjang masih kosong')
        navigate('/cart')
        return
      }
      setCartItems(data)
    } catch (error) {
      toast.error('Gagal memuat keranjang')
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Pesanan berhasil dibuat!')
        navigate(`/orders/${data.orderId}`)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setProcessing(false)
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat checkout...</div>
  }

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Checkout</p>
        <h1 className="mt-2 section-title">Detail Pesanan</h1>
        <div className="mt-5 space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-cream-50 px-4 py-3">
              <div>
                <p className="font-semibold text-coffee-900">{item.name}</p>
                <p className="text-sm text-coffee-600">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <p className="font-bold text-coffee-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="card p-6">
        <h2 className="text-xl font-semibold text-coffee-900">Pembayaran</h2>
        <div className="mt-3 rounded-2xl bg-coffee-900 text-white p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-cream-200">Transfer Bank</p>
          <p className="mt-2 text-2xl font-bold">BCA 1234567890</p>
          <p className="mt-1 text-sm text-cream-100">a.n. Backseat Barista</p>
        </div>

        <div className="mt-6 space-y-3 text-sm text-coffee-700">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totalAmount)}</span></div>
          <div className="flex justify-between border-t border-cream-200 pt-3 text-base font-bold text-coffee-900"><span>Total</span><span>{formatPrice(totalAmount)}</span></div>
        </div>

        <button onClick={handleCheckout} disabled={processing} className="btn-primary w-full mt-6">
          {processing ? 'Memproses...' : 'Konfirmasi Pesanan'}
        </button>
      </aside>
    </div>
  )
}
