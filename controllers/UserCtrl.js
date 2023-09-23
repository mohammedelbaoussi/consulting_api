const { signRefreshToken, signAccessToken } = require('../helpers/generateToken')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async(req, res) =>{
        try{
          
            const { firstName, lastName, email, password} = req.body

            const doesExist = await User.findOne({email})

            if(doesExist) return res.status(400).json({
                msg: "this email is already registred."
            })

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = { firstName, lastName, email, password:passwordHash}

            const user = new User(newUser)
            const savedUser = await user.save()

            const access_token = signAccessToken({savedUser})
            const refresh_token = signRefreshToken({savedUser})
            
            res.cookie('refreshtoken', refresh_token,{
                HttpOnly: true,
                SameSite: 'none',
                maxAge: 30*24*60*1000
            })

            res.json({
                msg: 'register success',
                access_token,
                savedUser
            })

        }catch(err){
             return res.status(500).json({msg: err.message})
        }

    },
    login: async(req, res) =>{
        try{
 
             const {email, password} = req.body
             const user = await User.findOne({email})
 
             if(!user) return res.status(400).json({
                 msg: "this account does not exist"
             })
             
             loginUser(user, password, res)
         }catch(err){
         return res.status(500).json({msg: err.message})
        }
     },
 
     logout: async(req, res) =>{
         try{
             res.clearCookie('refreshtoken')
             return res.status(200).json({
                msg: 'Logged out',
            })
         }catch(err){
             return res.status(500).json({msg: err.message})
         }
     },
 
     refreshToken: async(req, res) =>{
         try{
            
             const rf_token = req.cookies.refreshtoken

             if(!rf_token) return res.status(400).json({msg: "Please login now!"})
 
             const decoded = jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
 
             if(!decoded) return res.status(400).json({msg: 'Please login now!'})
 
             const user = await User.findById(decoded.user._id)
             if(!user) return res.status(400).json({msg: "Please login now!"})
 
             const access_token = signAccessToken({id: user._id})
 
            return res.json({access_token, user})
         }catch(err){
             return res.status(500).json({msg: err.message})
         }
     },

     getAlluser: async(req, res) =>{
        try{
            const users = await User.find({})
    
            return res.status(200).json(users)
            }catch(err){
                return res.status(500).json({msg: err.message})
            }
     },
     updateUserRole: async(req, res) =>{
        try{
            const user = await User.findOneAndUpdate({_id: req.params.id}, {role: (req.body.role)}, {new: true})

            if(!user) return res.status(400).json({
                msg: "user does not exist"
            })

            return res.status(200).json({
                msg: "Update Success",
                user
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
     },
     getSingleUser: async(req, res) =>{
        try{
            const user = await User.findOne({ _id: req.params.id})

            if(!user) return res.status(400).json({
                msg: "Product does not exist"
            })

            return res.status(200).json({
                user
            })

        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },
}

const loginUser = async(user, password, res) =>{
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        let msgError = user.type === 'register'? "Password is incorrect": `Password is incorrect. this account loign with ${user.type}`

        return res.status(400).json({msg: msgError})
       }

        const access_token = signAccessToken({user})
        const refresh_token = signRefreshToken({user})

        res.cookie('refreshtoken', refresh_token, {
            HttpOnly: true,
            SameSite: 'none',
            maxAge: 30*24*60*1000
        })
    
        res.json({
            msg: 'login success',
            access_token,
            user
        })
}