const { addCategory, getCategories, updateCategory, deleteCategory, getSingleCategory } = require("../controllers/categoryCtrl")
const { requireSignIn, adminMiddleware } = require("../middelwares")


const express = require('express')
const router = express.Router()



router.post('/category/addcategory',requireSignIn,adminMiddleware,addCategory) 
router.get('/category/getcategory', getCategories)
router.get('/category/getcategory/:id', getSingleCategory)
router.put('/category/updatecategory/:id',requireSignIn,adminMiddleware,updateCategory)
router.delete('/category/deletecategory/:id',requireSignIn,adminMiddleware,deleteCategory)



module.exports = router