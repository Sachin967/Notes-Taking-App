import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes'
import 'dotenv/config'
import notesRouter from './routes/notesRoutes'
import { protect } from './services/middleware'

const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
const corsOptions = {
     origin: ['https://note.sachinms.fyi','http://localhost:5173'],
     credentials: true,
}
app.use(cors(corsOptions))
app.use('/users', userRouter)
app.use('/notes',protect, notesRouter)

app.listen(port, () => {
     console.log(`server is running on ${port}`)
})
