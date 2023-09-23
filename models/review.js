const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
   user: {type: mongoose.Types.ObjectId, 
      ref: 'user'
    },
    blog_id: mongoose.Types.ObjectId,

    content: {
        type: String,
        required: true
    },
   createdAt : {
     type: Date, 
     required: true, 
     default: Date.now 
    }
},{
    timestamps: true
})

const Reviews = mongoose.model('reviews', reviewSchema)

module.exports = Reviews