import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'
import AppLayout from '../components/layout/AppLayout'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import NotFoundPage from '../pages/NotFoundPage'
import DashboardPage from '../pages/student/DashboardPage'
import CoursesPage from '../pages/student/CoursesPage'
import CourseDetailPage from '../pages/student/CourseDetailPage'
import RegistrationsPage from '../pages/student/RegistrationsPage'
import ProfilePage from '../pages/student/ProfilePage'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import ManageCoursesPage from '../pages/admin/ManageCoursesPage'
import ManageStudentsPage from '../pages/admin/ManageStudentsPage'
import ManageRegistrationsPage from '../pages/admin/ManageRegistrationsPage'

export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />}
      />
      <Route
        path="/signup"
        element={!user ? <SignupPage /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />}
      />

      {/* Student Routes — unified AppLayout */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard"     element={<DashboardPage />} />
        <Route path="/courses"       element={<CoursesPage />} />
        <Route path="/courses/:id"   element={<CourseDetailPage />} />
        <Route path="/registrations" element={<RegistrationsPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
      </Route>

      {/* Admin Routes — same unified AppLayout */}
      <Route
        element={
          <AdminRoute>
            <AppLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin"                    element={<AdminDashboardPage />} />
        <Route path="/admin/courses"            element={<ManageCoursesPage />} />
        <Route path="/admin/students"           element={<ManageStudentsPage />} />
        <Route path="/admin/registrations"      element={<ManageRegistrationsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
