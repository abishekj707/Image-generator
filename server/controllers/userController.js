import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from '../models/transactionModel.js';

const registerUser = async (req, res)=>{
    try{
        const {name, email, password} = req.body

        if(!name || !email || !password){
            return res.json({success:false, message:'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token, user: {name: user.name}})

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}
;
const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body;  //for login we need only email and password
        const user = await userModel.findOne({email})    // to find the user, we use userModel

        if(!user){    //if the user email is not available in db
            return res.json({success:false, message: 'User does not exist'})
        } //else user available
        const isMatch = await bcrypt.compare(password, user.password) //it compares the current pass with user pass

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token, user: {name: user.name}})

        }else{ //else password didn't match
            return res.json({success:false, message: 'Invalid credentials'})
        }

    } catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const userCredits = async (req, res) =>{
    try{
        const userId = req.userId //const {userId} = req.body

        const user = await userModel.findById(userId)
        res.json({success: true, credits: user.creditBalance, user: {name: user.name}})
    }catch(error)
    {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async(req, res) =>{
    try {  //first we need user id and plan id for making the razorpay payment
        
        const {planId} = req.body //const {userId, planId} = req.body
        const userId = req.userId

        //we should find the user using userId and plan details using planId
        const userData = await userModel.findById(userId) //userModel to find the user

        if(!userId || !planId){
            return res.json({success: false, message: 'Missing Details'})
        }

        let credits, plan, amount, date

        switch(planId){ //switch case for different plans and gettng the planId from req.body
            case 'basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;
                
            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({success: false, message: 'Invalid Plan'})
        }

        date = date.now()

        const transactionData = {
            userId, plan, credits, amount, date
        } //we have to store the transaction data in mongodb database

        const newTransaction = await transactionModel.create(transactionData) //so it create and store the transaction data in db

        const options = {
            amount: amount * 100, //amount should be in paise, so we multiply by 100
            currency: process.env.CURRENCY,
            receipt: newTransaction._id, //receipt is a unique identifier for the order, in newTransaction on Id will be created by mongodb, so we can use that id as receipt
        }
        //these options will be used to create the order in razorpay, and it will return the order details in the callback function, which we can use to make the payment in frontend
        await razorpayInstance.orders.create(options, (error, order)=>{ //if any error occurs while creating the order, it will return the error in the error parameter, or if the order is created successfully, it will return the order details in the order parameter
            if(error){
                console.log(error)
                return res.json({success: false, message: error})
            }
            res.json({success: true, order})
        })

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {registerUser, loginUser, userCredits, paymentRazorpay} // using this controller function we should create api endpoints in routes folder, and then we can use those endpoints in frontend to make the api calls for registration, login, getting user credits and making payment using razorpay