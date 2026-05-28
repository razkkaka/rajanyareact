import { useEffect, useState } from 'react'
import { FiCheck, FiEye, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
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

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success('Status diupdate')
        fetchOrders()
      }
    } catch (error) {
      toast.error('Gagal mengupdate status')
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const filters = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu Pembayaran' },
    { value: 'waiting_verification', label: 'Verifikasi' },
    { value: 'paid', label: 'Dibayar' },
    { value: 'processing', label: 'Diproses' },
    { value: 'completed', label: 'Selesai' },
  ]

  const filteredOrders = filter === 'all' ? orders : orders.filter((order) => order.status === filter)

  const statusLabel = (status) => ({
    pending: 'Menunggu Pembayaran',
    waiting_verification: 'Menunggu Verifikasi',
    paid: 'Dibayar',
    processing: 'Diproses',
    completed: 'Selesai',
    rejected: 'Ditolak',
  }[status] || 'Menunggu Pembayaran')

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat pesanan...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Order Management</p>
        <h1 className="mt-2 section-title">Kelola Pesanan</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button key={item.value} onClick={() => setFilter(item.value)} className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === item.value ? 'bg-coffee-700 text-white' : 'bg-cream-100 text-coffee-700'}`}>{item.label}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-cream-100 text-coffee-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Pelanggan</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-cream-200">
                  <td className="px-4 py-3 font-semibold text-coffee-900">#ORD-{String(order.id).padStart(4, '0')}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-coffee-900">{order.customer_name || 'Customer'}</div>
                    <div className="text-xs text-coffee-600">{order.customer_email || '-'}</div>
                  </td>
                  <td className="px-4 py-3 text-coffee-700">{formatPrice(order.total_amount)}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-semibold text-coffee-700">{statusLabel(order.status)}</span></td>
                  <td className="px-4 py-3 text-coffee-700">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {order.status === 'paid' && <button onClick={() => updateStatus(order.id, 'processing')} className="p-2 rounded-lg bg-purple-50 text-purple-600"><FiEye /></button>}
                      {order.status === 'processing' && <button onClick={() => updateStatus(order.id, 'completed')} className="p-2 rounded-lg bg-green-50 text-green-600"><FiCheck /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
