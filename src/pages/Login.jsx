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
        // Simpan token DAN data user agar sistem tahu role-nya apa
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user)) 
        
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

  // FUNGSI UNTUK MENGISI OTOMATIS AKUN DEMO
  const fillDemoAdmin = () => {
    setFormData({ email: 'fathia@backseat.com', password: 'owner123' })
    toast.success('Akun demo terisi otomatis!')
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
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                className="input-field pl-10" 
                placeholder="email@example.com" 
                required 
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-coffee-800">Password</span>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" />
              {/* PERBAIKAN: Placeholder tanda tanya diganti jadi titik-titik */}
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                className="input-field pl-10 pr-10" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword((value) => !value)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* UI TOMBOL DEMO ADMIN */}
        <div 
          className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 cursor-pointer hover:bg-amber-100 transition"
          onClick={fillDemoAdmin}
        >
          <div className="text-xs font-bold text-amber-800 mb-1.5">💡 Demo Akun Admin (klik untuk isi otomatis)</div>
          <div className="text-xs text-amber-700">📧 fathia@backseat.com &nbsp; 🔑 owner123</div>
        </div>

        <p className="mt-6 text-sm text-coffee-700">
          Belum punya akun? <Link to="/register" className="font-semibold text-coffee-800 hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  )
}