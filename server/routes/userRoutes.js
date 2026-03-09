import express from 'express'
import {registerUser, loginUser, userCredits} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser) //it execute registerUser from userController.js
userRouter.post('/login', loginUser) // http://localhost:4000/api/user/login
userRouter.get('/credits',  userAuth, userCredits)

export default userRouter