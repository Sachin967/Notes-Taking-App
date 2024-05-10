import express, { Router } from 'express'
import { VerifyOtp, authUser, logOut, registerUser, resendOtp } from '../controllers/userController'

const userRouter: Router = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', authUser)
userRouter.post('/verify', VerifyOtp)
userRouter.post('/signout', logOut)
userRouter.post('/resendotp', resendOtp)

export default userRouter
