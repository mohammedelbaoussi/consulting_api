const mongoose = require('mongoose')
const consultationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,
            "Veuillez ajouter votre nom"
        ],
        trim: true
    },
 
    email: {
        type: String,
        required: [true,
            "Veuillez ajouter votre adresse e-mail"
        ],
        trim: true
    },
    phone:{
      type: Number,
      required: [true,
        "Veuillez ajouter votre numero de telephon"
    ]
    },
    sujet:{
         type: String,
         trim: true
    },

   message:{
        type: String
   },
   paid:{
    type: Boolean,
    default: false
   },

   answered:{
    type: Boolean,
    default: false
   }
    


}, { timestamps: true})

const Consultation = mongoose.model('Consultation', consultationSchema)

module.exports = Consultation