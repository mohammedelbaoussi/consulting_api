const { addConsultaion, getSingleConsultation, getConsultations, updateConsultationPaid, updateConsultationAnswered, deleteConsultation } = require("../controllers/consultaionCtrl")



const express = require('express')
const { requireSignIn, adminMiddleware } = require("../middelwares")
const router = express.Router()



router.post('/addconsultation',addConsultaion)
router.get('/getconsultation/:id', getSingleConsultation)
router.get('/getconsultations',getConsultations)
router.put('/updatePaid/:id',requireSignIn, adminMiddleware,  updateConsultationPaid)
router.put('/updateAnswered/:id',requireSignIn, adminMiddleware, updateConsultationAnswered)
router.delete('/deleteConsultation/:id',requireSignIn, adminMiddleware, deleteConsultation)


module.exports = router