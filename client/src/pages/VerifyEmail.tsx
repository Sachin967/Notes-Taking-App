import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { users } from '../axios'
import { useDispatch } from 'react-redux'
import { AuthActions } from '../store/Authslice'

const VerifyEmail: React.FC = () => {
     const Navigate = useNavigate()
     const { id, token } = useParams<{ id: string; token: string }>()

     useEffect(() => {
          validateToken()
     }, [id, token])
     const Dispatch = useDispatch()
     const validateToken = () => {
          users.post(`/verify/${id}/${token}`)
               .then((res) => {
                    if (res.data) {
                         Navigate('/')
                         Dispatch(AuthActions.Userlogin(res.data))
                    }
               })
               .catch((error) => {
                    console.log(error)
                    toast.error(error.message)
               })
     }

     return (
          <div>
               <h1>Verifying Email...</h1>
               {/* Add loading spinner or message if needed */}
          </div>
     )
}

export default VerifyEmail
