import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

function ToastWrapper() {
  const { isDark } = useTheme()
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme={isDark ? 'dark' : 'light'}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastWrapper />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
