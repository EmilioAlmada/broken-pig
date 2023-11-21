import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import Header from './Header';

const ProtectedRoutes = () => {
  const isAuth = localStorage.getItem('token'); 

  if (!isAuth) return <Navigate to='/login' />

  return (
    <div>
      <div>
        <Sidebar />
      </div>
      <div>
        <div>
          <Header />
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedRoutes