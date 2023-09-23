const slugify = require('slugify')
const Category = require('../models/category')


const createCategories = (categories, parentId = null) =>{

    const categoryList =[]
    let category;
    if(parentId == null){
       category = categories.filter(cat => cat.parentId == undefined)
    }else{
        category = categories.filter( cat => cat.parentId == parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList
}

module.exports = {
    addCategory: async (req, res) =>{
        try{
            const categoryObj = {
                name: req.body.name,
                slug: slugify(req.body.name)
            }

            const cat = await Category.findOne({slug: categoryObj.slug})

            if(cat){
                return res.status(400).json({
                    msg: "Cette catégorie existe déjà"
                })
            }
            
            if(req.file){
                categoryObj.categoryImage = process.env.APP_URL + '/public' + req.file.filename
            }
            if(req.body.parentId){
                categoryObj.parentId = req.body.parentId
            }

            const newCategory = new Category(categoryObj)

            const savedCategory = await newCategory.save()
            

            return res.status(201).json({
                msg: "Catégorie ajoutée avec succès",
                Category: savedCategory
            })

        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    getCategories: async (req, res) =>{
        try{
            categories = await Category.find()
            
            if(categories){
                
                const categoryList = await createCategories(categories)


                return res.status(200).json({ 
                    msg: "Liste des catégories",
                    categoryList
                })
            }
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getSingleCategory: async(req, res) =>{
        try{
            const category = await Category.findOne({ _id: req.params.id})

            if(!category) return res.status(400).json({
                msg: "La catégorie n'existe pas"
            })

            return res.status(200).json({
                category
            })

        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    updateCategory: async(req, res) =>{
        try{
            const category = await Category.findOneAndUpdate({_id: req.params.id}, {name: (req.body.category.name)}, {new: true})

            if(!category) return res.status(400).json({
                msg: "La catégorie n'existe pas"
            })

            return res.status(200).json({
                msg: "Mis à jour avec succés",
                category
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    },

    deleteCategory: async(req, res) =>{

        try{
            const category = await Category.findByIdAndDelete(req.params.id)

            if(!category) return res.status(400).json({
                msg: "La catégorie n'existe pas"
            })

            return res.status(200).json({
                msg: "Supprimé avec succès"
            })
        }catch(err){
            return res.status(500).json({
                msg: err.message
            })
        }
    }

}


