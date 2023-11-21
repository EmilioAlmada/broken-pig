import { Navigate, Outlet } from "react-router-dom"

const AuthRoutes = () => {
  const isAuth = localStorage.getItem('token')

  if (isAuth) return <Navigate to='/' />
    
  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AuthRoutes