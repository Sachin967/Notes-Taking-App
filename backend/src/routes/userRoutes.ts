import express, { Router } from 'express'
import { authUser, logOut, registerUser, verifyTokenExpirationAndUpdateUser } from '../controllers/userController'

const userRouter: Router = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', authUser)
userRouter.post('/verify/:token/:id', verifyTokenExpirationAndUpdateUser)
userRouter.post('/signout', logOut)

export default userRouter
