import { Navigate } from 'react-router-dom'
import { useAuthStore, isAdmin } from '../store/authStore'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin(user)) return <Navigate to="/" replace />
  return children
}
