import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const BuyCredit = () => {

  const {user, backendUrl, loadCreditsData, token, setShowLogin} = useContext(AppContext)

    const navigate = useNavigate() //to navigate to home page after the user made the payment

    const initPay = async(order)=>{  //order parameter for reciving or making order data
      console.log(order);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, //razorpay key id from .env file
        amount: order.amount,
        currency: order.currency,
        name: 'Credits Payment',
        description: 'Credits Payment',
        order_id: order.id,
        recipt: order.recipt,
        handler: async (response)=>{
          console.log(response);

        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    }

    const paymentRazorpay = async(planId)=>{ //onClick func
      console.log("payment clicked")
      try {
        if(!user){
          setShowLogin(true)
          return
        }

        //if the user is logged in then will make api call to the razorpay api in backend
        const {data}= await axios.post(backendUrl + '/api/user/pay-razor', {planId},
        {headers: {token}}) //our middleware will get this token and find the user id

        console.log("razorpay response", data);
        if (data.success){ //it will initialize the payment 
            initPay(data.order)  //when the data.success is true we will call the initPay bcz in response we will get the order
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <motion.div
    initial={{opacity:0.2, y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1, y:0}}
    viewport={{once:true}}
    className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2
      rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6
      sm:mb-10'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index)=>(
          <div key={index}
          className='bg-white drop-shadow-sm border rounded-lg py-12 px-8
          text-gray-600 hover:scale-105 transition-all duration-500'>
            <img width={40} src={assets.logo_icon} alt='' className='mx-auto mb-4'/>
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}
                </span> / {item.credits} credits</p>
                <button onClick={()=>paymentRazorpay(item.id)} className='w-full bg-gray-800 text-white mt-8
                text-sm rounded-md py-2.5 min-w-52'>{user ? 'Purchase' : 'Get Started'}</button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit;