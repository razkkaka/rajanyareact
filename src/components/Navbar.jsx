import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiMenu, FiShoppingCart, FiUser, FiX, FiPackage, FiLogOut, FiGrid } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isOwner } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coffee-700 to-coffee-900 flex items-center justify-center text-white font-bold">B</div>
            <div>
              <p className="font-display text-xl font-bold text-coffee-900">Backseat Barista</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-coffee-500">Coffee & Collaboration</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-coffee-700">
            <Link to="/" className="hover:text-coffee-900">Beranda</Link>
            <Link to="/menu" className="hover:text-coffee-900">Menu</Link>
            <Link to="/collaboration" className="hover:text-coffee-900">Kolaborasi</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/favorites" className="p-2 rounded-full hover:bg-cream-100 text-coffee-700" aria-label="Favorit"><FiHeart /></Link>
                <Link to="/cart" className="p-2 rounded-full hover:bg-cream-100 text-coffee-700" aria-label="Keranjang"><FiShoppingCart /></Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((value) => !value)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-cream-100 text-coffee-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-coffee-700 text-white flex items-center justify-center text-xs font-bold">{user.name?.[0]?.toUpperCase()}</div>
                    <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-cream-200 rounded-2xl shadow-soft py-2">
                      <div className="px-4 py-3 border-b border-cream-100">
                        <p className="font-semibold text-coffee-900">{user.name}</p>
                        <p className="text-sm text-coffee-600">{user.email}</p>
                      </div>
                      {isOwner && (
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-coffee-700 hover:bg-cream-50">
                          <FiGrid className="text-sm" /> Dashboard Admin
                        </Link>
                      )}
                      <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-coffee-700 hover:bg-cream-50">
                        <FiPackage className="text-sm" /> Pesanan Saya
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-red-50">
                        <FiLogOut className="text-sm" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Masuk</Link>
                <Link to="/register" className="btn-primary">Daftar</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg bg-cream-100 text-coffee-700" onClick={() => setIsOpen((value) => !value)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white">
          <div className="px-4 py-3 space-y-2 text-sm font-medium text-coffee-700">
            <Link to="/" onClick={() => setIsOpen(false)} className="block py-2">Beranda</Link>
            <Link to="/menu" onClick={() => setIsOpen(false)} className="block py-2">Menu</Link>
            <Link to="/collaboration" onClick={() => setIsOpen(false)} className="block py-2">Kolaborasi</Link>
            {user ? (
              <>
                <Link to="/favorites" onClick={() => setIsOpen(false)} className="block py-2">Favorit</Link>
                <Link to="/cart" onClick={() => setIsOpen(false)} className="block py-2">Keranjang</Link>
                <Link to="/orders" onClick={() => setIsOpen(false)} className="block py-2">Pesanan Saya</Link>
                {isOwner && <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2">Dashboard Admin</Link>}
                <button onClick={handleLogout} className="w-full text-left py-2 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2">Masuk</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
