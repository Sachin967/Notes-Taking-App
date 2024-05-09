import express from 'express'
import userRouter from './routes/userRoutes'
import 'dotenv/config'
import notesRouter from './routes/notesRoutes'
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use('/users', userRouter)
app.use('/notes', notesRouter)

app.listen(port, () => {
     console.log(process.env)
     console.log(`server is running on ${port}`)
})
