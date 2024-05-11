import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import VerifyEmail from './pages/VerifyEmail'
import { PrivateRoutes } from './PrivateRoutes'
import Home from './pages/Home'

function App() {
     return (
          <>
               <div className="bg-[#FFFFFF]">
                    <ToastContainer />
                    <BrowserRouter>
                         <Routes>
                              <Route path="/login" element={<Login />} />
                              <Route path="/register" element={<SignUp />} />
                              <Route path="/verifyemail/:id/:token" element={<VerifyEmail />} />
                              <Route path="" element={<PrivateRoutes />}>
                                   <Route path="/" element={<Home />}></Route>
                              </Route>
                         </Routes>
                    </BrowserRouter>
               </div>
          </>
     )
}

export default App
