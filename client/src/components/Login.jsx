import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Login')
  const {setShowLogin, backendUrl, setToken, setUser} = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler =  async (e) =>{
    e.preventDefault();  // it will prevent the web page from reloading when we press the submit the form

    try {
      
      if(state === 'Login'){
      const {data} = await axios.post(backendUrl + '/api/user/login',  //we have to concatenate url + login url to axios
          {email, password})                                          //for login we need only email and pass

          if(data.success){  //means we are successfully logged in
            setToken(data.token)  //after logged in we have to get the token from backend response and set the available token to setToken in appContext
            setUser(data.user)
            localStorage.setItem('token',data.token) //after we have store the token in browser local storage
            setShowLogin(false) //after logged in, the login form should be hidden
          }else{
            toast.error(data.message)
          } //data.success is false
      }else{   //not login
        const {data} = await axios.post(backendUrl + '/api/user/register',
          {name, email, password})           //for register we need name email and pass

          if(data.success){
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token',data.token)
            setShowLogin(false)
          }else{
            toast.error(data.message)
          } //data.success is false
      }

    } catch (error) {
      toast.error(data.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';  // to hide the scrollbar when the login form is open

    return () => {
      document.body.style.overflow = 'unset';  // to restore the scrollbar when the login form is closed
    }
  },[])

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0
    backdrop-blur-sm bg-black/30 flex justify-center items-center
    z-10'>
      
      <motion.form onSubmit={onSubmitHandler}
      initial={{opacity:0.2, y:50}}
      transition={{duration:0.3}}
      whileInView={{opacity:1, y:0}}
      viewport={{once:true}}
      className='relative bg-white p-10 rounded-xl
      text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700
        font-medium'>{state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue</p>

        {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2
        rounded-full mt-5'>
            <img src={assets.user_icon} alt=''/>
            <input onChange={e=>setName(e.target.value)} value={name} type="text" className='text-sm outline-none'
            placeholder="Enter your name" required/>
        </div>}
        <div className='border px-6 py-2 flex items-center gap-2
        rounded-full mt-4'>
            <img src={assets.email_icon} alt=''/>
            <input onChange={e=>setEmail(e.target.value)} value={email} type="email" className='text-sm outline-none'
            placeholder="Email id" required/>
        </div>
        <div className='border px-6 py-2 flex items-center gap-2
        rounded-full mt-4'>
            <img src={assets.lock_icon} alt=''/>
            <input onChange={e=>setPassword(e.target.value)} value={password} type="password" className='text-sm outline-none'
            placeholder="Password" required/>
        </div>
        <p className='text-sm text-blue-600 my-4
        cursor-pointer'>Forget password?</p>

        <button className='bg-blue-600 text-white w-full py-2
        rounded-full'>{state === 'Login' ? 'Login' : 'Create account'}</button>

        {state === 'Login' ? <p className='mt-5 text-center'>Don't have an account? <span
        className='text-blue-600 cursor-pointer' onClick={()=>setState('Sign Up')}>Sign up</span></p>
        :
        <p className='mt-5 text-center'>Already have an account? <span
        className='text-blue-600 cursor-pointer' onClick={()=>setState('Login')}>Login</span></p>}

        <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt='' className='absolute top-5
        right-5 cursor-pointer'/>
      </motion.form>
    </div>
  )
}

export default Login
