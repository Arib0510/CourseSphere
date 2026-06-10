import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

export default function AdminRoute({ children }) {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-[#F8F6F3]">
      <Loader size="lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}
