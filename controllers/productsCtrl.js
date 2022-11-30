const Products = require('../models/productsModel')
const Users = require('../models/userModels')
const Payments = require('../models/paymentModel')
//Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        // console.log({after: queryObj}) //after delete params

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // lte, gte = less/greater than or equal
        // lt, gt = less/greater than
        // regex = compare ~ string 
        // console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting(){

        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        
        return this;
    }
    slide(){
        this.query = this.query.limit(8)
        return this;
    }
}

const productsCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting()
            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
           
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getProductsQuery: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).slide().filtering().sorting()
            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
           
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async (req, res) => {
        try {
            const {product_id, title, description, content, price, images, color, size, category, countInStock} = req.body;
            if(!images) 
                return res.status(400).json({msg: 'No Image uploaded'})
            const product = await Products.findOne({product_id})
            if(product) 
                return res.status(400).json({msg: 'ID product already exists.'})
            
            const newProduct = await Products({
                product_id, title: title.toLowerCase(), description, content, price, images, size, colors: color, category, countInStock
            })
            await newProduct.save()
            res.json('Created a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json('Deleted a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async (req, res) => {
        try {
            const {title, description, content, price, images, color, size, category, countInStock} = req.body;
            if(!images)
                return res.status(400).json({msg: 'No Image uploaded'})

            await Products.findOneAndUpdate({_id: req.params.id},{
                title: title.toLowerCase(), description, content, price, images, size, colors: color, category, countInStock
            })

            res.json('Updated a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createReview: async (req, res) => {
        try {
            const {rating, comment} = req.body;
            const product = await Products.findById(req.params.id);
            const product_id = product.product_id
            const user = await Users.findById(req.user.id);
            const userName = user.username
            const imageProfile = user.imageProfile
            const history = await Payments.find({$and: [{user_id: req.user.id},{status: 'Delivered'}]})

            const cartsArray = history.map(item => {return item.cart})
            var productsArray = cartsArray.flat()
            const proIdArray = productsArray.map(item => { return item.product_id; })
            // console.log(typeof carts, carts)
    
            if(product) {
                const boughtProduct = proIdArray.includes(product_id)
                
                if(!boughtProduct) {
                    return res.status(400).json({msg: 'Hãy mua sản phẩm để đánh giá cho chúng tôi nhé!'})
                }

                const alreadyReviewed = product.reviews.find(
                    (r) => r.user.toString() === req.user.id.toString()
                )

                if(alreadyReviewed){
                    return res.status(400).json({msg: 'Bạn đã đánh giá sản phẩm này rồi.'})
                }

                const review = {
                    name: userName,
                    rating: Number(rating),
                    comment,
                    user: req.user.id,
                    imageUser: imageProfile
                }
                product.reviews.push(review)
                product.numReviews = product.reviews.length
                product.rating = 
                product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

                await product.save()
                res.status(201).json({msg: 'Cảm ơn bạn đã đánh giá cho chúng tôi.'})
            } else {
                return res.status(400).json({msg: 'Product not found'})
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changePublish : async (req, res) => {
        try {
            const { isPublished } = req.body
            
            await Products.findOneAndUpdate({_id: req.params.id}, {
                isPublished
            })

            return res.json({msg: "Product publish is updated."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productsCtrl;