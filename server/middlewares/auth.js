import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) =>{
    const token = req.headers.token || req.headers.authorization?.split('')[1]; //const {token} = req.headers;

    if(!token){
        return res.json({success: false, message: 'Not Authorized. Login Again'})
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);        //to verify the token secret key

        if(tokenDecode.id){
            req.userId = tokenDecode.id; //req.body.userId
        }else{
            return res.json({success: false, message: 'Not Authorized. Login Again'})
        }
        next();

    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export default userAuth;