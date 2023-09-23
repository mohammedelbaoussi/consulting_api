const express = require('express')
const { addBlog, getSingleBlog, updateBlog, deleteBlog, getBlogs , getBlogsByCategory, getHomeBlogs} = require('../controllers/blogCtrl')
const { requireSignIn, adminMiddleware } = require('../middelwares')



const router = express.Router()

router.post('/addblog', requireSignIn,adminMiddleware ,addBlog)
router.get('/blogs', getBlogs)
router.get('/blog/:id', getSingleBlog)
router.get('/homeblogs', getHomeBlogs)
router.put('/updateblog/:id',requireSignIn,adminMiddleware, updateBlog)
router.get('/blogs/category/:id', getBlogsByCategory)
router.delete('/deleteblog/:id',requireSignIn, adminMiddleware, deleteBlog)

module.exports = router