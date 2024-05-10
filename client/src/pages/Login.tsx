import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { users } from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../store/Authslice'
import { RootState } from '../store/store'
import { AxiosResponse } from 'axios'

interface FormState {
     email: string
     password: string
}
const Login = () => {
     const Navigate = useNavigate()
     const userLoggedIn: boolean = useSelector((state: RootState) => state.auth.Userisloggedin)
     useEffect(() => {
          if (userLoggedIn) {
               Navigate('/')
          }
     }, [userLoggedIn, Navigate])
     const [passwordVisible, setPasswordVisible] = useState(false)
     const Dispatch = useDispatch()
     const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible)
     }

     const [formState, setFormState] = useState<FormState>({
          email: '',
          password: '',
     })
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target
          setFormState((prevState) => ({
               ...prevState,
               [name]: value,
          }))
     }

     const validateForm = () => {
          if (!formState.email || !formState.password) {
               toast.error('Both fields are required!')
               return false
          }
          return true
     }
     const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()

          const isValid = validateForm()
          if (isValid) {
               try {
                    const response: AxiosResponse = await users.post('/login', formState, { withCredentials: true })

                    if (response.data) {
                         Dispatch(AuthActions.Userlogin(response.data))
                         Navigate('/')
                    } else {
                         toast.error('Login failed. Please check your credentials.')
                    }
               } catch (error) {
                    toast.error('An error occurred during login. Please try again later.')
               }
          }
     }
     return (
          <div className="flex  items-center h-screen justify-center">
               <div className="md:w-[1100px] flex items-center justify-between mr-5">
                    <div>
                         <img className="hidden md:block object-contain " src="./signin.png" alt="Signin" />
                    </div>
                    <div>
                         <form
                              onSubmit={handleSignIn}
                              className="border-2 shadow-2xl shadow-[#3A244A] bg-gray-50 rounded-xl  p-8"
                         >
                              <div className="text-4xl text-[#3A244A] my-3 text-start font-bold mb-4">
                                   <h1>
                                        Fill what we know<span className="text-[#D72638]">!</span>
                                   </h1>
                              </div>

                              <div className="my-5">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="email"
                                        type="text"
                                        placeholder="Email"
                                        onChange={(e) => handleChange(e)}
                                        value={formState.email}
                                   />
                              </div>
                              <div className="relative my-6">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Password"
                                        onChange={(e) => handleChange(e)}
                                        value={formState.password}
                                   />
                                   <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                                        onClick={togglePasswordVisibility}
                                   >
                                        {passwordVisible ? (
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="w-6 h-6"
                                             >
                                                  <path d="M12 4c-4 0-7.2 3.1-7.9 7.3-.1.4-.1.8-.1 1.2C4 16.6 7.6 20 12 20c4.4 0 8-3.4 8-7.5 0-.4 0-.8-.1-1.2-.7-4.2-3.9-7.3-7.9-7.3zM12 17.8c-2.4 0-4.4-1.8-4.7-4 .3-2.1 2.3-4 4.7-4s4.4 1.8 4.7 4c-.3 2.2-2.3 4-4.7 4z" />
                                                  <circle cx="12" cy="12" r="2" />
                                             </svg>
                                        ) : (
                                             <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="w-6 h-6"
                                             >
                                                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                  <path d="M9.15 9.15a6 6 0 0 1 0 8.485M23 23l-9-9" />
                                             </svg>
                                        )}
                                   </button>
                              </div>

                              <button className="bg-[#3A244A] my-5 w-full text-white h-14 rounded-xl" type="submit">
                                   Sign In
                              </button>
                              <button
                                   onClick={() => Navigate('/register')}
                                   className="bg-[#ffffff] w-full text-[#3A244A] border border-[#3A244A] h-14 rounded-xl"
                              >
                                   Sign Up
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     )
}
export default Login
