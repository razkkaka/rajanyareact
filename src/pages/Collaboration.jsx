import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiBriefcase, FiMessageSquare, FiPhone, FiSend } from 'react-icons/fi'

export default function Collaboration() {
  const [formData, setFormData] = useState({ business_name: '', business_type: '', contact: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/collaboration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        toast.success('Pengajuan berhasil dikirim!')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto card p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Kolaborasi</p>
        <h1 className="mt-2 section-title">Pengajuan Terkirim!</h1>
        <p className="mt-3 text-coffee-700">Terima kasih atas minat Anda. Tim Backseat Barista akan segera menghubungi Anda.</p>
      </div>
    )
  }

  const benefits = [
    'Akses ke platform e-commerce yang sudah berjalan',
    'Dukungan pemasaran dan promosi bersama',
    'Jaringan pelanggan yang sudah ada',
    'Sistem order dan pembayaran terintegrasi',
    'Pendampingan pengembangan bisnis',
  ]

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
      <section className="card p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Kolaborasi UMKM</p>
        <h1 className="mt-2 section-title">Berkolaborasi bersama Backseat Barista</h1>
        <p className="mt-3 text-coffee-700">Mari wujudkan pertumbuhan bisnis F&B bersama platform yang mendukung distribusi, branding, dan order management.</p>

        <div className="mt-5 space-y-3">
          {benefits.map((item, index) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-cream-50 p-3">
              <div className="w-6 h-6 rounded-full bg-coffee-700 text-white text-xs flex items-center justify-center mt-0.5">{index + 1}</div>
              <p className="text-sm text-coffee-800">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center gap-2 text-coffee-700">
          <FiBriefcase /> <span className="font-semibold">Ajukan Kolaborasi</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Nama Usaha</span>
            <div className="relative"><FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} className="input-field pl-10" required /></div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Jenis Produk</span>
            <select value={formData.business_type} onChange={(e) => setFormData({ ...formData, business_type: e.target.value })} className="input-field" required>
              <option value="">Pilih jenis produk</option>
              <option value="Minuman">Minuman</option>
              <option value="Makanan">Makanan</option>
              <option value="Snack">Snack</option>
              <option value="Dessert">Dessert</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Nomor Kontak</span>
            <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="input-field pl-10" required /></div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Pesan (Opsional)</span>
            <div className="relative"><FiMessageSquare className="absolute left-3 top-3 text-coffee-400" /><textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field pl-10 resize-none" rows="4" /></div>
          </label>

          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Mengirim...' : 'Kirim Pengajuan'}</button>
        </form>
      </section>
    </div>
  )
}
