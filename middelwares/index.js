const jwt =  require('jsonwebtoken')
const User = require('../models/User')

module.exports={

    requireSignIn: async(req, res, next)=>{
        try{
           
            const token = req.headers.authorization.split('Bearer ')[1]
         
            if(!token) return res.status(400).json({
                msg: "Invalid authentication"
            })
            
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if(!decode) return res.status(400).json({
                msg: 'Invalid authentication'
            })
            
            
            const user = await User.findOne({_id: decode.id}).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist"})
            
            req.user = user

            next()
        }catch(err){
                     return res.status(500).json({
                        msg: err.message
                     })
        }
    },

    userMiddleware: async(req, res, next) =>{
        try{
            if(req.user.role !== 'user'){
                return res.status(400).json({
                    msg: 'user access denied'
                })
            }
            next()
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    adminMiddleware: async(req, res, next) =>{
        try{
            if(req.user.role !== 'admin'){
                return res.status(400).json({
                    msg: 'admin access denied'
                })
            }
            next()
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    }
           
}