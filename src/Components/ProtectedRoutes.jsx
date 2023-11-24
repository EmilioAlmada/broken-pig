import React, { useCallback, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthContext } from '../Auth/AuthProvider';
import useFetch from '../hooks/useFetch';
import { useBasicDataContext } from '../Auth/BasicDataProvider';
import LoadingErrorWraper from './LoadingErrorWraper';

const ProtectedRoutes = () => {
  const { authUser, setAuthUser } = useAuthContext()
  const { setBasicData, basicData} = useBasicDataContext()
  const isAuth = localStorage.getItem('token'); 
  const userData = localStorage.getItem('user'); 

  if (!isAuth) return <Navigate to='/login' />

  const getBasicData = useCallback(async () => {
    const [data, error] = await useFetch('/basicData');
    if (data) {
      setBasicData(data.data)
    }else {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    if (!authUser) {
      setAuthUser(JSON.parse(userData))
    }
    getBasicData()
  }, [getBasicData]);

  return (
    <div style={{width: '100%'}}>
        <Header />
        <Sidebar />
        <main style={{  display: 'flex', marginLeft: '15.3em', marginTop: '3em' }}>
          <Outlet />
        </main>
    </div>
  )
}

export default ProtectedRoutes