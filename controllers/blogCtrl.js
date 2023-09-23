const Blog = require("../models/blog")
const slugify = require('slugify')


module.exports ={
 
    addBlog : async(req, res)=>{
            
        try{
            const {title, description,thumbnail} = req.body
          

            const blog = await Blog.findOne({slug: slugify(title)})
            
            if(blog) return res.status(400).json({msg: "Ce blog existe déjà"})

        
        const newBlog = new Blog({
            title,
            slug: slugify(title),
            description,
            thumbnail,

        })
        const savedBlog = await newBlog.save()

        return res.status(201).json({
            msg: 'Blog ajouté avec succès',
            savedBlog
        })

         }catch(err){
                    return res.status(500).json({
                        msg: err.message
                    })
                }
        },
    getBlogs: async(req, res)=>{
        try{
            // const Blogs = await Blog.aggregate([
            //     {
            //         //user
            //         $lookup:{
            //             from : 'users',
            //             let: { user_id: "$createdBy"},
            //             pipeline: [
            //                 { $match: {$expr: {$eq: ["$_id", "$$user_id"]} }}
            //             ],
            //             as: "createdBy"
            //         }
            //     },
            //      {$unwind: "$createdBy"},
   
            //    //   category
            //     {
            //         $lookup:{
            //             from: "categories", 
            //             let: {category_id: "$categoryId"},
            //             pipeline: [
            //                 { $match: {$expr: {$eq: [
            //                     "$_id", "$$category_id"
            //                 ]}}}
            //             ],
            //             as: "categoryId"
            //         }
            //     },
            //     {$unwind: "$categoryId"},
            //     {$sort: { "createAt": -1}},
            //     //pagination
   
                
            // ])

            const Blogs = await Blog.find({}).sort({createdAt: -1})
   
            return res.status(200).json({
                Blogs,
               
            })
           }catch(err){
            return res.status(500).json({
                msg: err.message
            })
           }
    },
    getBlogsByCategory: async(req, res)=>{
        const { limit, skip } = Pagination(req)

        try{
            const Data = await Blog.aggregate([
                {
                    $facet: {
                        totalData: [
                          { 
                            $match:{ 
                              category: mongoose.Types.ObjectId(req.params.id) 
                            } 
                          },
                     
                          // array -> object
                          { $unwind: "$user" },
                          // Sorting
                          { $sort: { createdAt: -1 } },
                          { $skip: skip },
                          { $limit: limit }
                        ],
                        totalCount: [
                          { 
                            $match: { 
                              category: mongoose.Types.ObjectId(req.params.id) 
                            } 
                          },
                          { $count: 'count' }
                        ]
                      }
                },
                {
                    $project: {
                      count: { $arrayElemAt: ["$totalCount.count", 0] },
                      totalData: 1
                    }
                  }
            ])

            const blogs = Data[0].totalData;
            const count = Data[0].count

            //Pagination

            let total = 0;
            if(count % limit === 0){
                total = count / limit;
            }else{
                total = Math.floor(count / limit) + 1;
            }

            res.json({blogs, total})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getSingleBlog: async(req, res) =>{
        try{
            const blog = await Blog.findOne({ _id: req.params.id})

            if(!blog) return res.status(400).json({
                msg: "Le produit n'existe pas"
            })

            return res.status(200).json({
                blog
            })

        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    
    updateBlog: async(req, res) =>{
       
        try{
            
            const blog = await Blog.findOneAndUpdate({ _id: req.params.id},req.body.newData,{new: true})
            if(!blog) return res.status(400).json({
                msg: "Le produit n'existe pas"
            })

            return res.status(200).json({
                msg: 'Mise à jour réussie !',
                blog
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    
    deleteBlog: async(req, res) =>{
        try{
            const blog = await Blog.findOneAndDelete({_id: req.params.id})

            if(!blog) return res.status(400).json({
                msg: "Le produit n'existe pas"
            })
            else return res.status(200).json({
                msg: "Produit supprimé avec succès"
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },
    getHomeBlogs: async(req, res)=>{
        try{
         const Blogs = await Blog.aggregate([
            //  {
            //      //user
            //      $lookup:{
            //          from : 'users',
            //          let: { user_id: "$createdBy"},
            //          pipeline: [
            //              { $match: {$expr: {$eq: ["$_id", "$$user_id"]} }}
            //          ],
            //          as: "createdBy"
            //      }
            //  },
            //   {$unwind: "$createdBy"},

            //   category
             {
                 $lookup:{
                     from: "categories", 
                     let: {category_id: "$categoryId"},
                     pipeline: [
                         { $match: {$expr: {$eq: [
                             "$_id", "$$category_id"
                         ]}}}
                     ],
                     as: "categoryId"
                 }
             },
             {$unwind: "$categoryId"},
             {$sort: { "createAt": -1}},
             {
                 $group:{
                     _id: "$categoryId.name",
                     categoryName: {$first: "$categoryId.name"},
                     blogs: {$push: "$$ROOT"},

                 },
             },
             //pagination

             {
                 $project:{
                     blogs:{
                         $slice: ["$blogs", 0, 4]
                     },
                     count: 1,
                     name: 1
                 }
             }
             
         ])

         return res.status(200).json({
             Blogs,
            
         })
        }catch(err){
         return res.status(500).json({
             msg: err.message
         })
        }
     },
}