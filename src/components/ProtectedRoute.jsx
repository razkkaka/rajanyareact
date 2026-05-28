import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireOwner = false }) {
  const { user, loading, isOwner } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-coffee-700">Memuat sesi...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/" replace />
  }

  return children
}
