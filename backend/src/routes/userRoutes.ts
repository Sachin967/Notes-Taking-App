import express, { Router } from 'express'
import { VerifyOtp, authUser, logOut, registerUser } from '../controllers/userController'

const userRouter: Router = express.Router()
userRouter.post('/register',registerUser)
userRouter.post('/login',authUser)
userRouter.post('/verify', VerifyOtp)
userRouter.post('/signout', logOut)

export default userRouter
