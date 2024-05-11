import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { pool } from '../services/database'
import {
     generateSalt,
     generatePassword,
     generateOTP,
     sendOTP,
     generateToken,
     validatePassword,
     verifyToken,
} from '../services/utils'

interface RegisterUserRequest extends Request {
     body: {
          name: string
          email: string
          password: string
     }
}

interface LoginUserRequest extends Request {
     body: {
          email: string
          password: string
     }
}
const registerUser = async (req: RegisterUserRequest, res: Response, next: NextFunction) => {
     const { name, email, password } = req.body

     try {
          const salt = await generateSalt()
          const userPassword = await generatePassword(password, salt)
          const otp = generateOTP()

          const emailExistsQuery = 'SELECT * FROM users WHERE email = $1'
          const emailExistsResult = await pool.query(emailExistsQuery, [email])

          if (emailExistsResult.rows.length > 0) {
               res.status(400)
               throw new Error('User already exists')
          }

          const token = crypto.randomBytes(20).toString('hex')
          const expirationTime = new Date()
          expirationTime.setHours(expirationTime.getHours() + 1)

          const insertUserQuery = `
            INSERT INTO users (name, email, password, otp, salt,verify_token,expiry_timestamp)
            VALUES ($1, $2, $3, $4, $5,$6,$7)
            RETURNING id`
          const insertUserValues = [name, email, userPassword, otp, salt, token, expirationTime]
          const userResult = await pool.query(insertUserQuery, insertUserValues)

          const userId = userResult.rows[0].id

          const otpResponse = await sendOTP(email, token, userId)

          await generateToken(res, userId)
          const response = {
               Id: userId,
               otpResponse: otpResponse,
          }

          res.json(response)
     } catch (error) {
          console.log(error)
          next(error)
     }
}

const verifyTokenExpirationAndUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
     const { id, token } = req.params
     try {
          const tokenNotExpired = await verifyToken(id, token)
          if (!tokenNotExpired) {
               res.status(400).json({ status: false, message: 'Token is expired' })
               return
          }
          const fetchUserQuery = 'SELECT * FROM users WHERE id = $1'
          const fetchUserValues = [id]
          const fetchUserResult = await pool.query(fetchUserQuery, fetchUserValues)
          const user = fetchUserResult.rows[0]

          if (!user) {
               res.status(404).json({ status: false, message: 'User not found' })
               return
          }

          const updateQuery = 'UPDATE users SET verified = $1 WHERE id = $2 RETURNING *'
          const updateValues = [true, id]
          const updateResult = await pool.query(updateQuery, updateValues)
          const updatedUser = updateResult.rows[0]

          if (!updatedUser) {
               res.status(500).json({ status: false, message: 'Failed to update user' })
               return
          }

          res.json({
               name: updatedUser.name,
               email: updatedUser.email,
               verified: updatedUser.verified,
          })
     } catch (error) {
          console.error(error)
          next(error)
     }
}

const authUser = async (req: LoginUserRequest, res: Response, next: NextFunction) => {
     const { email, password } = req.body

     try {
          const fetchUserQuery = 'SELECT * FROM users WHERE email = $1'
          const fetchUserValues = [email]
          const fetchUserResult = await pool.query(fetchUserQuery, fetchUserValues)

          const user = fetchUserResult.rows[0]

          if (!user) {
               res.status(401).json('Invalid email or password')
               return
          }

          if (!user.verified) {
               res.status(403).json('You are not verified')
               return
          }

          const validPassword: boolean = await validatePassword(password, user.salt, user.password)

          if (!validPassword) {
               res.status(401).json('Invalid email or password')
               return
          }

          await generateToken(res, user.id)

          res.json({
               name: user.name,
               email: user.email,
          })
     } catch (error) {
          console.log(error)
          next(error)
     }
}

const logOut = async (req: Request, res: Response) => {
     try {
          res.cookie('jwt', '', {
               httpOnly: true,
               expires: new Date(0),
          })
          res.status(200).json({ status: true, message: 'Logged out' })
          return
     } catch (error) {
          if (error instanceof Error) res.status(500).json({ message: error.message })
     }
}

export { registerUser, verifyTokenExpirationAndUpdateUser, authUser, logOut }
