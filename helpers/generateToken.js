const jwt = require('jsonwebtoken')


module.exports = {

    signActiveToken: (payload ={})=>{
        const secret = process.env.ACTIVE_TOKEN_SECRET

        return jwt.sign(payload, secret, {expiresIn: '10m'})
    },
    signAccessToken: (payload ={})=>{
        const secret = process.env.ACCESS_TOKEN_SECRET

        return jwt.sign(payload, secret, {expiresIn: '1D'})
    },
    signRefreshToken: (payload ={})=>{
        const secret = process.env.REFRESH_TOKEN_SECRET

        return jwt.sign(payload, secret, {expiresIn: '356d'})
    },
}