import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()

import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'

const app = express()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}
).catch(err => {
    console.log(err);
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
