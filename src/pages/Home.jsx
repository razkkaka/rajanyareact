import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCoffee, FiHeart, FiTruck, FiUsers } from 'react-icons/fi'

export default function Home() {
  const [mood, setMood] = useState('cozy')
  const [preference, setPreference] = useState('coffee')
  const [budget, setBudget] = useState('30k-40k')
  const [recommendation, setRecommendation] = useState('Temukan minuman favoritmu disini!')
  const [loading, setLoading] = useState(false)

  const traits = [
    { icon: FiCoffee, title: 'Bahan Premium', description: 'Kopi dan non-kopi pilihan dari pemasok terbaik dengan standar cafe.' },
    { icon: FiTruck, title: 'Pengiriman Cepat', description: 'Pesanan dibuat dan diproses dengan fokus kenyamanan pelanggan.' },
    { icon: FiHeart, title: 'Dibuat dengan Cinta', description: 'Setiap cup diracik untuk pengalaman rasa yang menyenangkan.' },
    { icon: FiUsers, title: 'Kolaborasi UMKM', description: 'Mendukung usaha lokal dengan platform order dan katalog profesional.' },
  ]

  const handleRecommend = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, preference, budget }),
      })
      const data = await response.json()
      setRecommendation(data.recommendation || 'Coba menu baru kami!')
    } catch (error) {
      setRecommendation('Koneksi AI tidak tersedia, tetapi menu tetap menarik!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center card overflow-hidden">
        <div className="p-7 md:p-10">
          <span className="inline-flex rounded-full bg-coffee-100 px-3 py-1 text-xs font-semibold text-coffee-700">New Season Menu</span>
          <h1 className="mt-5 font-display text-5xl md:text-6xl font-bold text-coffee-900">Experience the Art of Coffee</h1>
          <p className="mt-4 text-lg text-coffee-700 max-w-xl">Backseat Barista menghadirkan menu minuman premium, pengalaman belanja yang halus, serta peluang kolaborasi UMKM F&B yang profesional.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/menu" className="btn-primary">Jelajahi Menu <FiArrowRight /></Link>
            <Link to="/collaboration" className="btn-secondary">Kolaborasi</Link>
          </div>
        </div>
        <div className="relative min-h-[320px] bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-600 p-6 flex items-end">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="relative z-10 w-full rounded-3xl bg-white/10 backdrop-blur border border-white/20 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-cream-200">Sampel Menu</p>
            <div className="mt-4 grid gap-3">
              {['Iced Palm Sugar Latte', 'Cold Brew', 'Matcha Latte'].map((item, index) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 flex items-center justify-between">
                  <span className="font-medium">{item}</span>
                  <span className="text-xs">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        {traits.map((item) => (
          <div key={item.title} className="card p-5">
            <div className="w-10 h-10 rounded-xl bg-coffee-100 text-coffee-700 flex items-center justify-center">
              <item.icon className="text-lg" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-coffee-900">{item.title}</h2>
            <p className="mt-2 text-sm text-coffee-700">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <div className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-coffee-600">AI Assistant</p>
          <h2 className="mt-2 section-title text-3xl">Rekomendasi lebih cepat</h2>
          <p className="mt-3 text-coffee-700">Gunakan Groq AI untuk rekomendasi minuman sesuai suasana, preferensi, dan budget.</p>

          <div className="mt-5 space-y-3">
            <label className="block text-sm font-medium text-coffee-800">Mood</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)} className="input-field">
              <option value="cozy">Cozy</option>
              <option value="fresh">Fresh</option>
              <option value="energetic">Energetic</option>
            </select>

            <label className="block text-sm font-medium text-coffee-800">Preferensi</label>
            <select value={preference} onChange={(e) => setPreference(e.target.value)} className="input-field">
              <option value="coffee">Kopi</option>
              <option value="non-coffee">Non-Kopi</option>
              <option value="mixed">Campuran</option>
            </select>

            <label className="block text-sm font-medium text-coffee-800">Budget</label>
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="input-field">
              <option value="20k-30k">20k-30k</option>
              <option value="30k-40k">30k-40k</option>
              <option value="40k+">40k+</option>
            </select>

            <button onClick={handleRecommend} className="btn-primary w-full mt-2" disabled={loading}>{loading ? 'Menganalisis...' : 'Dapatkan rekomendasi'}</button>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-white to-cream-50">
          <div className="text-sm uppercase tracking-[0.24em] text-coffee-600">Hasil AI</div>
          <div className="mt-4 rounded-3xl bg-coffee-900 text-white p-5 min-h-40">
            <p className="text-xs uppercase tracking-[0.2em] text-cream-200">Rekomendasi hari ini</p>
            <p className="mt-4 text-lg leading-relaxed">{recommendation}</p>
          </div>
          <div className="mt-5 text-sm text-coffee-700">
            <p className="font-semibold text-coffee-900">Tips</p>
            <p className="mt-2">Gunakan rekomendasi untuk mempercepat keputusan pelanggan dan buat penjualan lebih personal.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
