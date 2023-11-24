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
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BasicDataProvider from './Auth/BasicDataProvider'

function App() {

  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <BasicDataProvider>
            <Routes>
              <Route path="/" element={<AuthRoutes />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="askpasswordrecover" element={<ForgotPassword />} />
                <Route path="passwordresetwithtoken/:token" element={<ResetPassword />} />
              </Route>
              <Route path="/" element={<ProtectedRoutes />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<Transactions />} />
              </Route>
            </Routes>
          </BasicDataProvider>
        </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  )
}

export default App
