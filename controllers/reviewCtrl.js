const Reviews = require('../models/review')
const mongoose = require('mongoose')


const Pagination = (req)=>{
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;

    return {page, limit, skip};

}

module.exports ={
    createReview: async(req, res)=>{

        try{
            const {content, blog_id} = req.body

            const newReview = new Reviews({ user: req.user._id, content, blog_id})

            await newReview.save()

            return res.json(newReview)
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    getReviews: async(req, res)=>{
        const {limit, skip} = Pagination(req)

        try{
            const data = await Reviews.aggregate([
                {
                    $facet: {
                      totalData:[
                        { $match: {
                          blog_id: new mongoose.Types.ObjectId(req.params.id),
                        }},
                        {
                          $lookup: {
                            "from": "users",
                            "let": { user_id: "$user" },
                            "pipeline": [
                              { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                              { $project: { firstName: 1, lastName:1, avatar: 1 } }
                            ], 
                            "as": "user"
                          }
                        },
                        { $unwind: "$user" },
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                      ],
                      totalCount: [
                        { $match: {
                          blog_id: new mongoose.Types.ObjectId(req.params.id),
                        }},
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

            const reviews = data[0].totalData;
            const count = data[0].count;
           
            let total = 0;

            if(count % limit === 0){
              total = count / limit;
            }else{
              total = Math.floor(count / limit) + 1;
            }

            // const reviews = 
      
            return res.json({ reviews, total })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getAllReviews: async(req, res)=>{
      try{
      const reviews = await Reviews.find({})

      return res.status(200).json(reviews)
      }catch(err){
          return res.status(500).json({msg: err.message})
      }
  },

    
      updateReview: async (req, res) => {
    
        try {

          const review = await Reviews.findOneAndUpdate({
            _id: req.params.id, user: req.user.id
          }, { content: req.body.content })
    
          if(!review)
            return res.status(400).json({msg: "l'avis n'existe pas."})
    
          return res.json({msg: "Succès mis à jour !"})
          
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      },

      deleteReview: async (req, res) => {
        if(!req.user)
          return res.status(400).json({msg: "invalid Authentication."})
    
        try {
    
          const review = await Reviews.findOneAndDelete({_id: req.params.id,})
          
          if(!review)
            return res.status(400).json({msg: "l'avis n'existe pas."})

          return res.json({msg: "Succès supprimé !"})
          
        } catch (err) {
          return res.status(500).json({msg: err.message})
        }
      }
}