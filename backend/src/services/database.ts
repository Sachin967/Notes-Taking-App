import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
     host: process.env.HOST ,
     port: parseInt(process.env.DB_PORT || '5432'),
     user: process.env.USER,
     password: process.env.PASSWORD ,
     database: process.env.DB_NAME ,
})

export { pool }
