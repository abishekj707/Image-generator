import express from 'express'
import {registerUser, loginUser, userCredits, paymentRazorpay} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser) //it execute registerUser from userController.js
userRouter.post('/login', loginUser) // http://localhost:4000/api/user/login
userRouter.get('/credits',  userAuth, userCredits) //we need userAuth for user authentication, because only authenticated user can access his credits, so we will use userAuth middleware for this route, and then we will execute userCredits controller function to get the user credits
userRouter.post('/pay-razor',  userAuth, paymentRazorpay) //this userAuth will add the user Id using the token and userAuth is used for converting token into userId

export default userRouter