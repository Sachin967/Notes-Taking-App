import {  useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from './store/store'

export const PrivateRoutes = () => {
     const { Userisloggedin } = useSelector((state: RootState) => state.auth)
  return Userisloggedin ? <Outlet /> : <Navigate to="/login" replace />
}
