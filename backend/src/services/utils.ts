import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from './database'

// export const sendOTP = (email: string, otp: string): Promise<string> => {
//      return new Promise((resolve, reject) => {
//           let transporter = nodemailer.createTransport({
//                service: 'gmail',
//                auth: {
//                     user: process.env.GMAIL as string,
//                     pass: process.env.PASS as string,
//                },
//           })
//           let mailOptions = {
//                from: 'your-email@gmail.com',
//                to: email,
//                subject: 'Your OTP for Verification',
//                text: `Your OTP is: ${otp}`,
//           }

//           transporter.sendMail(mailOptions, (error, info) => {
//                if (error) {
//                     console.log(error.message)
//                     reject(error.message)
//                } else {
//                     console.log('Email sent: ' + info.response)
//                     resolve(info.response)
//                }
//           })
//      })
// }

export const generateToken = (res: Response, userId: string): void => {
     const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
          expiresIn: '30d',
     })
     res.cookie('jwt', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 30 * 24 * 60 * 60 * 1000,
     })
}

export const generateOTP = (): string => {
     const digits = '0123456789'
     let OTP = ''
     for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)]
     }
     return OTP
}

export const generateSalt = async (): Promise<string> => {
     return await bcrypt.genSalt()
}

export const generatePassword = async (password: string, salt: string): Promise<string> => {
     return await bcrypt.hash(password, salt)
}

export const validatePassword = async (
     enteredPassword: string,
     salt: string,
     savedPassword: string
): Promise<boolean> => {
     const hashedEnteredPassword = await bcrypt.hash(enteredPassword, salt)
     return hashedEnteredPassword === savedPassword
}

export const verifyToken = async (id: string, token: string): Promise<boolean> => {
     try {
          const userQuery = 'SELECT verify_token, expiry_timestamp FROM users WHERE id = $1'
          const { rows } = await pool.query(userQuery, [id])

          if (rows.length === 0 || !rows[0].verify_token) {
               return false
          }

          const storedToken: string = rows[0].verify_token
          const expirationTimestamp: Date = rows[0].expiry_timestamp

          if (token !== storedToken) {
               return false
          }

          const currentTime: Date = new Date()
          if (currentTime > expirationTimestamp) {
               return false
          }

          return true
     } catch (error) {
          console.error('Error verifying token:', error)
          return false 
     }
}



export const sendOTP = (email: string, token: string, userId: string): Promise<string> => {
     console.log('token', token)
     return new Promise((resolve, reject) => {
          let transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                    user: process.env.GMAIL as string,
                    pass: process.env.PASS as string,
               },
          })
          let mailOptions = {
               from: 'your-email@gmail.com',
               to: email,
               subject: '[YOLO] Verify Your Email Address',
               text: `Dear User,

          Thank you for signing up with YOLO. To complete your registration and verify your email address, please click the link below:

          https://note.sachinms.fyi/verifyemail/${token}/${userId}

          This link will expire in 24 hours.

          If you did not create an account on YOLO, please ignore this email.

          Best Regards,
          Sachin M S`,
          }

          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.log(error.message)
                    reject(error)
               } else {
                    console.log('Email sent: ' + info.response)
                    resolve(info.response)
               }
          })
     })
}
