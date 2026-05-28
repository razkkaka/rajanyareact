import { useEffect, useState } from 'react'
import { FiCheck, FiImage, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Verification() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
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
      setOrders(data.filter((order) => order.status === 'waiting_verification'))
    } catch (error) {
      toast.error('Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (orderId, approved) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: approved ? 'paid' : 'rejected' }),
      })
      if (res.ok) {
        toast.success(approved ? 'Pembayaran diverifikasi' : 'Pembayaran ditolak')
        fetchOrders()
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat verifikasi...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Verifikasi</p>
        <h1 className="mt-2 section-title">Verifikasi Pembayaran</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card p-10 text-center text-coffee-700">Tidak ada pembayaran menunggu verifikasi.</div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-coffee-900">Order #{String(order.id).padStart(4, '0')}</p>
                  <p className="mt-1 text-sm text-coffee-700">Pelanggan: {order.customer_name || 'Customer'}</p>
                  <p className="text-sm text-coffee-700">Total: {formatPrice(order.total_amount)}</p>
                  <p className="text-sm text-coffee-700">Tanggal: {formatDate(order.created_at)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedImage(order.payment_proof)} className="inline-flex items-center gap-2 rounded-xl bg-cream-100 px-3 py-2 text-sm font-semibold text-coffee-800">
                    <FiImage /> Lihat
                  </button>
                  <button onClick={() => handleVerify(order.id, false)} className="inline-flex items-center gap-2 rounded-xl border border-red-500 px-3 py-2 text-sm font-semibold text-red-600">
                    <FiX /> Tolak
                  </button>
                  <button onClick={() => handleVerify(order.id, true)} className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-3 py-2 text-sm font-semibold text-white">
                    <FiCheck /> Setujui
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-coffee-900">Bukti Pembayaran</h3>
              <button onClick={() => setSelectedImage(null)} className="p-2 rounded-lg bg-cream-100 text-coffee-700"><FiX /></button>
            </div>
            <img src={selectedImage} alt="Bukti pembayaran" className="mt-4 rounded-2xl w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}
