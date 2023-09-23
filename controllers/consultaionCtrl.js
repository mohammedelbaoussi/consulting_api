const Consultation = require("../models/consultation")

module.exports ={
    addConsultaion : async(req, res)=>{

        try{
            const {name, email,phone, sujet, message} = req.body

        
        const newConsultation = new Consultation({
            name,
            email,
            phone,
            sujet,
            message

        })
        const savedConsultation = await newConsultation.save()

        return res.status(201).json({
            msg: 'Consultation added successfully',
            savedConsultation
        })

         }catch(err){
                    return res.status(500).json({
                        msg: err.message
                    })
                }
        },
        getSingleConsultation: async(req, res) =>{
            try{
                const consultation = await Consultation.findOne({ _id: req.params.id})
    
                if(!consultation) return res.status(400).json({
                    msg: "Consultation does not exist"
                })
    
                return res.status(200).json({
                    consultation
                })
    
            }catch(err){
                return res.status(500).json({
                    msg: err.message
                })
            }
        },
        getConsultations: async(req, res)=>{
            try{
            const consultaions = await Consultation.find({})
    
            return res.status(200).json(consultaions)
            }catch(err){
                return res.status(500).json({msg: err.message})
            }
        },
        updateConsultationPaid: async(req, res) =>{
            try{

                const consultation = await Consultation.findOneAndUpdate({_id: req.params.id}, {paid: (req.body.paid)}, {new: true})
    
                if(!consultation) return res.status(400).json({
                    msg: "user does not exist"
                })
    
                return res.status(200).json({
                    msg: "Update Success",
                    consultation
                })
            }catch(err){
                return res.status(500).json({
                    msg: err.message
                })
            }
         },
         updateConsultationAnswered: async(req, res) =>{
            try{

                const consultation = await Consultation.findOneAndUpdate({_id: req.params.id}, {answered: (req.body.answered)}, {new: true})
    
                if(!consultation) return res.status(400).json({
                    msg: "user does not exist"
                })
    
                return res.status(200).json({
                    msg: "Update Success",
                    consultation
                })
            }catch(err){
                return res.status(500).json({
                    msg: err.message
                })
            }
         },
         
    deleteConsultation: async(req, res) =>{

        try{
            const consultation = await Consultation.findByIdAndDelete(req.params.id)

            if(!consultation) return res.status(400).json({
                msg: "consultation does not exist"
            })

            return res.status(200).json({
                msg: "Delete Success"
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    }
}