import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from './database'
export interface CustomRequest extends Request {
     user?: any 
}
const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
     const token = req.cookies.jwt
     if (token) {
          try {
               const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
               const userData = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId])
               const user = userData.rows[0]
               if (user) {
                    req.user = user
                    next()
               } else {
                    res.status(401)
                    throw new Error('User not found')
               }
          } catch (error) {
               res.status(401)
               throw new Error('Invalid token')
          }
     } 
}

export { protect }
