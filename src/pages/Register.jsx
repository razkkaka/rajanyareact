import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiLock, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error('Konfirmasi password tidak sesuai')
      return
    }
    if (formData.password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Akun berhasil dibuat!')
        navigate('/login')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Daftar</p>
        <h1 className="mt-2 section-title">Buat Akun</h1>
        <p className="mt-2 text-coffee-700">Daftar agar bisa memesan, menyimpan favorit, dan melacak pesanan Anda.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Nama Lengkap</span>
            <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field pl-10" required /></div>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Email</span>
            <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field pl-10" required /></div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">No. Telepon</span>
            <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field pl-10" /></div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Alamat</span>
            <div className="relative"><FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-field pl-10" /></div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Password</span>
            <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" /><input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field pl-10 pr-10" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Konfirmasi Password</span>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="input-field" required />
          </label>

          <div className="md:col-span-2">
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Memproses...' : 'Daftar'}</button>
          </div>
        </form>

        <p className="mt-4 text-sm text-coffee-700">Sudah punya akun? <Link to="/login" className="font-semibold text-coffee-800">Masuk di sini</Link></p>
      </div>
    </div>
  )
}
