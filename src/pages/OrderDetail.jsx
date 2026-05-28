import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiCheckCircle, FiClock, FiUpload, FiXCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        navigate('/orders')
      }
    } catch (error) {
      toast.error('Gagal memuat detail pesanan')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadPayment = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowed.includes(file.type)) {
      toast.error('Format file harus JPG atau PNG')
      return
    }

    const formData = new FormData()
    formData.append('payment_proof', file)
    setUploading(true)

    try {
      const res = await fetch(`/api/orders/${id}/payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Bukti pembayaran berhasil diunggah')
        await fetchOrder()
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Gagal mengunggah bukti pembayaran')
    } finally {
      setUploading(false)
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const statusMeta = {
    pending: { label: 'Menunggu Pembayaran', color: 'text-yellow-600', icon: FiClock },
    waiting_verification: { label: 'Menunggu Verifikasi', color: 'text-blue-600', icon: FiClock },
    paid: { label: 'Dibayar', color: 'text-green-600', icon: FiCheckCircle },
    processing: { label: 'Diproses', color: 'text-purple-600', icon: FiClock },
    completed: { label: 'Selesai', color: 'text-emerald-600', icon: FiCheckCircle },
    rejected: { label: 'Ditolak', color: 'text-red-600', icon: FiXCircle },
  }

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat detail pesanan...</div>
  }

  if (!order) return null

  const StatusIcon = statusMeta[order.status]?.icon || FiClock
  const statusClass = statusMeta[order.status]?.color || 'text-yellow-600'

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-coffee-700 hover:text-coffee-900">
        <FiArrowLeft /> Kembali ke riwayat
      </button>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Order #{String(order.id).padStart(4, '0')}</p>
            <h1 className="mt-2 section-title">Detail Pesanan</h1>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1 text-sm font-semibold ${statusClass}`}>
            <StatusIcon className="text-sm" /> {statusMeta[order.status]?.label}
          </div>
        </div>
        <p className="mt-2 text-sm text-coffee-700">{formatDate(order.created_at)}</p>

        <div className="mt-5 divide-y divide-cream-200">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-coffee-900">{item.product_name}</p>
                <p className="text-sm text-coffee-600">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <p className="font-bold text-coffee-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-cream-200 pt-4 flex justify-between text-base font-bold text-coffee-900">
          <span>Total</span>
          <span>{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {order.status === 'pending' && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-coffee-900">Upload Bukti Pembayaran</h2>
          <p className="mt-2 text-sm text-coffee-700">Upload file JPG/PNG untuk verifikasi pembayaran.</p>
          <label className="mt-4 btn-secondary cursor-pointer inline-flex">
            <FiUpload className="mr-2" /> {uploading ? 'Mengunggah...' : 'Pilih Bukti Pembayaran'}
            <input type="file" className="hidden" accept="image/*" onChange={handleUploadPayment} />
          </label>
        </div>
      )}

      {order.payment_proof && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-coffee-900">Bukti Pembayaran</h2>
          <img src={order.payment_proof} alt="Bukti pembayaran" className="mt-4 rounded-2xl border border-cream-200 max-h-80 object-cover" />
        </div>
      )}
    </div>
  )
}
