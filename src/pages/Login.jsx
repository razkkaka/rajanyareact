import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        toast.success('Login berhasil!')
        if (data.user.role === 'owner' || data.user.role === 'admin') navigate('/admin')
        else navigate('/')
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
        <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">Masuk</p>
        <h1 className="mt-2 section-title">Selamat Datang Kembali</h1>
        <p className="mt-2 text-coffee-700">Masuk ke akun Backseat Barista untuk melanjutkan pesanan dan melihat favoritmu.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Email</span>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field pl-10" placeholder="email@example.com" required />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Password</span>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field pl-10 pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</button>
        </form>

        <p className="mt-4 text-sm text-coffee-700">Belum punya akun? <Link to="/register" className="font-semibold text-coffee-800">Daftar sekarang</Link></p>
      </div>
    </div>
  )
}
