import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 1. KITA PISAHKAN LOGIKA LOGIN AGAR BISA DIPANGGIL KAPAN SAJA
  const processLogin = async (loginEmail, loginPassword) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user)) 
        
        toast.success('Login berhasil! Mengalihkan...')
        // Langsung lempar ke halaman admin jika role-nya owner/admin
        if (data.user.role === 'owner' || data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        toast.error(data.error || 'Email atau password salah')
      }
    } catch (error) {
      console.error("Error saat login:", error)
      toast.error('Gagal terhubung ke server')
    } finally {
      // Pastikan loading selalu berhenti walau error sekalipun
      setLoading(false)
    }
  }

  // 2. KETIKA TOMBOL "MASUK" DIKLIK MANUAL
  const handleSubmit = (e) => {
    e.preventDefault()
    processLogin(formData.email, formData.password)
  }

  // 3. KETIKA TOMBOL "DEMO AKUN" DIKLIK (SATU KLIK LANGSUNG LOGIN)
  const fillDemoAdmin = () => {
    const demoEmail = 'fathia@backseat.com'
    const demoPass = 'owner123'
    
    // Isi otomatis di layar
    setFormData({ email: demoEmail, password: demoPass })
    toast.loading('Mencoba masuk sebagai Admin...', { duration: 1500 })
    
    // Langsung jalankan proses login secara otomatis!
    processLogin(demoEmail, demoPass)
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

        {/* UI TOMBOL DEMO ADMIN KLIK LANGSUNG MASUK */}
        <div 
          className={`mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 transition ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-100'}`}
          onClick={!loading ? fillDemoAdmin : undefined}
        >
          <div className="text-xs font-bold text-amber-800 mb-1.5">💡 Demo Akun Admin (klik untuk langsung masuk)</div>
          <div className="text-xs text-amber-700">📧 fathia@backseat.com &nbsp; 🔑 owner123</div>
        </div>

        <p className="mt-6 text-sm text-coffee-700">
          Belum punya akun? <Link to="/register" className="font-semibold text-coffee-800 hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  )
}