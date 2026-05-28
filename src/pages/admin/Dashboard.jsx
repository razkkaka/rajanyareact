import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiBox, FiCheckCircle, FiClock, FiDollarSign, FiFileText, FiPackage, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token, user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/orders/stats/summary', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      toast.error('Gagal memuat statistik')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)

  const statCards = [
    { label: 'Total Pesanan', value: stats?.total_orders || 0, icon: FiPackage, color: 'bg-blue-500' },
    { label: 'Total Pendapatan', value: formatPrice(stats?.total_revenue || 0), icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Menunggu Verifikasi', value: stats?.pending_verification || 0, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Pesanan Selesai', value: stats?.completed || 0, icon: FiCheckCircle, color: 'bg-purple-500' },
  ]

  const menuItems = [
    { label: 'Manajemen Produk', path: '/admin/products', icon: FiBox, description: 'Tambah, edit, dan hapus menu.' },
    { label: 'Kelola Pesanan', path: '/admin/orders', icon: FiFileText, description: 'Pantau dan perbarui status pesanan.' },
    { label: 'Verifikasi Pembayaran', path: '/admin/verification', icon: FiShield, description: 'Verifikasi bukti pembayaran pelanggan.' },
  ]

  if (loading) {
    return <div className="card p-10 text-center text-coffee-700">Memuat dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-gradient-to-r from-coffee-900 to-coffee-700 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-cream-200">Dashboard Admin</p>
        <h1 className="mt-2 section-title text-white">Selamat datang, {user?.name}!</h1>
        <p className="mt-2 text-cream-100">Kelola produk, pesanan, dan verifikasi pembayaran dengan mudah.</p>
      </div>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} text-white flex items-center justify-center`}>
              <stat.icon className="text-lg" />
            </div>
            <p className="mt-4 text-sm text-coffee-600">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-coffee-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Menu Utama</p>
            <h2 className="mt-2 text-2xl font-semibold text-coffee-900">Kelola backoffice</h2>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="rounded-3xl border border-cream-200 p-5 hover:bg-cream-50 transition">
              <div className="w-10 h-10 rounded-xl bg-coffee-100 text-coffee-700 flex items-center justify-center">
                <item.icon className="text-lg" />
              </div>
              <p className="mt-4 font-semibold text-coffee-900">{item.label}</p>
              <p className="mt-2 text-sm text-coffee-700">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
