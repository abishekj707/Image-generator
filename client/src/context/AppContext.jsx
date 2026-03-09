import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'))//if there any token available in browser local storage that will be stored in token state variable

    const [credit, setCredit] = useState(0)//null
    //store backend url in 1 variable, so we can access it any component

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    console.log('backend url',backendUrl)

    const navigate = useNavigate();

    const loadCreditsData = async () =>{   //we have to find the credit using api
        try {
            console.log("Token",token)
            const {data} = await axios.get(backendUrl + '/api/user/credits',  //will get response in {data}
            {headers: {token:token}}) //{token}

            console.log("API Response",data)
            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const generateImage = async(prompt)=>{
        try {
            const{data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt},{headers: {token}}) //we should send the prompt to backend to generate the image
                if(data.success){ //after generating the image successfully we will get the response with success true, so we will check if data.success is true then we will call
                    loadCreditsData() //after generating the image we have to update the credits data, so we will call loadCreditsData function
                    return data.resultImage //after generating the image successfully we will get the response as resultImage, so we will return the resultImage to the component where we are calling generateImage function
                }else{
                    toast.error(data.message)
                    loadCreditsData() //if data.success is false then also we will call loadCreditsData function to update the credits data
                    if(data.creditBalance === 0){//if data.creditBalance is 0 then the user will redirect to the buy credits page where he can buy the credits
                        navigate('/buy')
                    }
                }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const logout = ()=>{
        localStorage.removeItem('token')  //it remove the item with the keyname(token)
        setToken('')
        setUser(null) //if user logged out no user should be there
    }

    useEffect(()=>{
        const storedToken = localStorage.getItem('token') //erase this line
        if(storedToken){ //token available  //if(token)
        setToken(storedToken) //erase this line
        loadCreditsData() //it will load the credits data //loadCreditsData()
        }
    },[])

    //to execute loadCreditsData function we use useEffect
    useEffect(()=>{
        if(token){ //token available
            loadCreditsData() //it will load the credits data
        }
    },[token])//whenever the token is changed useEffect function will be executed

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit,
        loadCreditsData, logout, generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;