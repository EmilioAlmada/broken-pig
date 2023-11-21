import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './Components/ProtectedRoutes'
import AuthRoutes from './Components/AuthRoutes'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/ForgotPassword'
import Dashboard from './Pages/Dashboard'
import Profile from './Pages/Profile'
import Transactions from './Pages/Transactions'
import AuthProvider from './Auth/AuthProvider'
import ResetPassword from './Pages/ResetPassword'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthRoutes />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="forgotpassword/:token" element={<ResetPassword />} />
          </Route>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
