const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,
            "Veuillez ajouter un titre"
        ],
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
   
    description: {
        type: String,
        required: [true,
            "Veuillez ajouter une description"
        ],
        trim: true
    },
    thumbnail:{
      type: String,
      required: [true,
        "Veuillez ajouter une miniature"
    ]
    },
    // categoryId:{
    //      type: mongoose.Schema.Types.ObjectId,
    //      ref: 'Category'
    // },

    reviews:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            },
            review: String
        }
    ],
    // createdAt: {
    //     type: String
    // }

}, { timestamps: true})


// blogSchema.virtual('slug').get(function() {
//     return slugify(this.name, { lower: true });
//   });

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog