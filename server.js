import 'express-async-errors'
import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()

//Db Connection and authenticate USer
import connectDB from './db/connect.js'

//routers
import authRouter from './routes/authRoute.js'
import jobsRouter from './routes/jobsRoute.js'

// Middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddelware from './middleware/error-handler.js'

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome!")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddelware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server is listenig on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
    }
}

start()