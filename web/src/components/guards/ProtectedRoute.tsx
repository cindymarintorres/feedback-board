import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '../shared/PageLoader'

export const ProtectedRoute = () => {
  const { state } = useAuth()
  if (state.isLoading) return <PageLoader />
  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
