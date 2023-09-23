const express = require('express')
const { register, login, logout,refreshToken, getAlluser, updateUserRole, getSingleUser } = require('../controllers/userCtrl')
const { requireSignIn, adminMiddleware } = require('../middelwares')


const router = express.Router()

router.post('/register', register )
router.post('/login', login)
router.get('/logout', logout)
router.get('/refreshtoken', refreshToken)
router.get('/allusers', requireSignIn, adminMiddleware,getAlluser)
router.get('/userDetails/:id', requireSignIn, adminMiddleware,getSingleUser)
router.put('/updateRoleUser/:id',requireSignIn, adminMiddleware,updateUserRole)


module.exports = router