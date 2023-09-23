const mongoose = require('mongoose')



const UserSchema = new mongoose.Schema({
      firstName: {
        type: String,
        required:[
            true,
            'add you first name please'
        ],
        trim: true,
        maxLength: [
            20,
            'Your name is up to 20 chars long'
        ]
      },
      lastName: {
        type: String,
        required:[
            true,
            'add you last name please'
        ],
        trim: true,
        maxLength: [
            20,
            'Your name is up to 20 chars long'
        ]
      },

      email:{
        type: String,
        required: [
            true,
            "Please add you email or phone number"
        ],
        trim: true,
        unique: true
      },
      password:{
        type: String,
        required: [
            true,
            "Please add you password"
        ],
        trim: true
      },
      avatar: {
        type: String,
        default: 'https://static.thenounproject.com/png/5034901-200.png'
      },
      role:{
        type: String,
        default: 'user'
      },
      type:{
        type: String,
        default: 'register'
      }
},{ timestamps: true})



const User = mongoose.model('User', UserSchema)

module.exports = User