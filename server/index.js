import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()

app.use(express.json())
app.use(cors())
await connectDB() //to call the mongodb collection only once

app.use('/api/user', userRouter)
console.log("User routes loaded")
app.use('/api/image', imageRouter)


app.get("/",(req,res)=>{
    res.send("API is working")
})

const port = process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`Server at http://localhost:${port}`)
})