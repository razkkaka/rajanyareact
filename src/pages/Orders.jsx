import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiClock, FiPackage, FiXCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      toast.error('Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: 'Menunggu Pembayaran', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
      waiting_verification: { label: 'Menunggu Verifikasi', color: 'bg-blue-100 text-blue-800', icon: FiClock },
      paid: { label: 'Dibayar', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
      processing: { label: 'Diproses', color: 'bg-purple-100 text-purple-800', icon: FiPackage },
      completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800', icon: FiCheckCircle },
      rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-800', icon: FiXCircle },
    }
    const config = configs[status] || configs.pending
    const Icon = config.icon
    return <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}><Icon className="text-xs" /> {config.label}</span>
  }

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat pesanan...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Riwayat</p>
        <h1 className="mt-2 section-title">Riwayat Pesanan</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-xl font-semibold text-coffee-900">Belum Ada Pesanan</p>
          <p className="mt-2 text-coffee-700">Mulai pesan minuman favoritmu sekarang.</p>
          <Link to="/menu" className="btn-primary mt-5">Lihat Menu</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold text-coffee-900">Order #{String(order.id).padStart(4, '0')}</p>
                <p className="mt-1 text-sm text-coffee-700">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
                <span className="font-bold text-coffee-900">{formatPrice(order.total_amount)}</span>
                <Link to={`/orders/${order.id}`} className="btn-secondary">Detail</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
