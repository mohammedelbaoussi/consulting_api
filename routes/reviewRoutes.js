const express = require('express')
const reviewCtrl = require('../controllers/reviewCtrl')
const {requireSignIn} = require('../middelwares')

const router = express.Router()

router.post('/review', requireSignIn, reviewCtrl.createReview)

router.get('/reviews/blog/:id', reviewCtrl.getReviews)
router.get('/reviews', reviewCtrl.getAllReviews)

router.patch('/review/:id', requireSignIn, reviewCtrl.updateReview)

router.delete('/review/:id', requireSignIn, reviewCtrl.deleteReview)

module.exports = router