import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { Response } from 'express'
import bcrypt from 'bcryptjs'

export const sendOTP = (email: string, otp: string): Promise<string> => {
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
               subject: 'Your OTP for Verification',
               text: `Your OTP is: ${otp}`,
          }

          transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                    console.log(error.message)
                    reject(error.message)
               } else {
                    console.log('Email sent: ' + info.response)
                    resolve(info.response)
               }
          })
     })
}

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
