import { useState, useEffect, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { users } from '../axios'
import { RootState } from '../store/store'

interface State {
     name: string
     email: string
     password: string
     confirmPassword: string
}

const SignUp: React.FC = () => {
     const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
     const userLoggedIn: boolean = useSelector((state: RootState) => state.auth.Userisloggedin)
     const Navigate = useNavigate()

     useEffect(() => {
          if (userLoggedIn) {
               Navigate('/')
          }
     }, [userLoggedIn, Navigate])

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
          dispatch({
               type: 'handleinput',
               field: e.target.name as keyof State,
               payload: e.target.value,
          })
     }

     const togglePasswordVisibility = () => {
          setPasswordVisible(!passwordVisible)
     }

     type Action = { type: 'handleinput'; field: keyof State; payload: string }

     const initialState: State = {
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
     }

     const reducer = (state: State, action: Action) => {
          switch (action.type) {
               case 'handleinput':
                    return {
                         ...state,
                         [action.field]: action.payload,
                    }
               default:
                    return state
          }
     }
     const [formstate, dispatch] = useReducer(reducer, initialState)

     const validateForm = () => {
          const emailRegex: RegExp = /^\S+@\S+\.\S+/

          if (!formstate.name || !formstate.email || !formstate.password || !formstate.confirmPassword) {
               toast.error('All fields are required.')
               return false
          }

          if (!emailRegex.test(formstate.email)) {
               toast.error('Invalid email format.')
               return false
          }

          if (formstate.password !== formstate.confirmPassword) {
               toast.error('Passwords do not match.')
               return false
          }
          return true
     }

     const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const isValid: boolean = validateForm()
          if (isValid) {
               try {
                    const response = await users.post('/register', formstate, { withCredentials: true })
                    console.log(response.status)
                    const { Id } = response.data
                    if (response.status === 200) {
                         console.log(response)
                         Navigate(`/verifyemail/${Id}`)
                    }
               } catch (err) {
                    console.log(err)
               }
          } else {
               toast.error('Not valid')
          }
     }

     return (
          <div className="flex  items-center h-screen justify-center">
               <div className="md:w-[1100px] flex items-center justify-between mr-5">
                    <div>
                         <img className="hidden md:block object-contain " src="./signup.png" alt="Signin" />
                    </div>
                    <div>
                         <form
                              onSubmit={handleSignup}
                              className="border-2 shadow-2xl shadow-[#3A244A] bg-gray-50 rounded-xl  p-7"
                         >
                              <div className="text-4xl flex justify-between text-[#3A244A] my-3 text-start font-bold mb-4">
                                   <div>
                                        <h1>
                                             Let us know<span className="text-[#D72638] ">!</span>
                                        </h1>
                                   </div>
                                   <div className="flex items-end ms-10">
                                        <Link to={'/login'} className="bg-[#ffffff] text-[#3A244A] text-xl rounded-xl">
                                             Sign <span className="text-[#D72638]">In</span>
                                        </Link>
                                   </div>
                              </div>

                              <div className="my-5">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="name"
                                        type="text"
                                        placeholder="Full Name"
                                        onChange={handleChange}
                                   />
                              </div>
                              <div className="my-5">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        onChange={handleChange}
                                   />
                              </div>
                              <div className="relative my-6">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Set Password"
                                        onChange={handleChange}
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
                              <div className="relative my-6">
                                   <input
                                        className="border-b border-gray-300 bg-gray-50 py-2 px-3 w-full focus:outline-none"
                                        name="confirmPassword"
                                        type={passwordVisible ? 'text' : 'password'}
                                        placeholder="Retype Password"
                                        onChange={handleChange}
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
                                   Sign Up
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     )
}

export default SignUp
