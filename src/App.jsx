import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

import Home from './pages/Home'
import Menu from './pages/Menu'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Collaboration from './pages/Collaboration'

import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import OrderManagement from './pages/admin/OrderManagement'
import Verification from './pages/admin/Verification'

export default function App() {
  const { isOwner } = useAuth() // Ambil status apakah yang login Admin/Owner

  return (
    <div className="min-h-screen bg-cream-50 text-coffee-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          
          {/* BLOKIR ADMIN DARI KERANJANG & CHECKOUT */}
          <Route path="/cart" element={isOwner ? <Navigate to="/admin" /> : <Cart />} />
          <Route path="/checkout" element={isOwner ? <Navigate to="/admin" /> : <Checkout />} />
          <Route path="/favorites" element={isOwner ? <Navigate to="/admin" /> : <ProtectedRoute><Favorites /></ProtectedRoute>} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/collaboration" element={<Collaboration />} />

          <Route path="/admin" element={<ProtectedRoute requireOwner><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute requireOwner><Products /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requireOwner><OrderManagement /></ProtectedRoute>} />
          <Route path="/admin/verification" element={<ProtectedRoute requireOwner><Verification /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}