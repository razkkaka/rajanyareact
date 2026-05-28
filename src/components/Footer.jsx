import { Link } from 'react-router-dom'
import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-cream-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold text-coffee-900">Backseat Barista</p>
          <p className="mt-3 text-sm text-coffee-700">Experience the Art of Coffee dengan kualitas premium dan kolaborasi UMKM lokal.</p>
        </div>
        <div>
          <p className="font-semibold text-coffee-900">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee-700">
            <li><Link to="/menu" className="hover:text-coffee-900">Menu</Link></li>
            <li><Link to="/collaboration" className="hover:text-coffee-900">Kolaborasi UMKM</Link></li>
            <li><Link to="/orders" className="hover:text-coffee-900">Riwayat Pesanan</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-coffee-900">Kontak</p>
          <ul className="mt-3 space-y-2 text-sm text-coffee-700">
            <li className="flex items-center gap-2"><FiMapPin className="text-coffee-600" /> Jl. Cibanteng Raya No.12, Bogor</li>
            <li className="flex items-center gap-2"><FiPhone className="text-coffee-600" /> 0812-3456-7890</li>
            <li className="flex items-center gap-2"><FiMail className="text-coffee-600" /> hello@backseatbarista.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 py-4 text-center text-xs text-coffee-600">
        © 2026 Backseat Barista. All rights reserved.
      </div>
    </footer>
  )
}
