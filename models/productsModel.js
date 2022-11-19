const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    comment: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    imageUser: {
        type: Object
    }
},{
    timestamps: true
})

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        trim: true,
        require: true
    },
    title: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    images: {
        type: Array,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    size: {
        type: Array,
        require: true
    },
    colors: {
        type: Array,
        require: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    sold: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        require: true,
        default: 0
    },
    numReviews: {
        type: Number,
        require: true,
        default: 0
    },
    countInStock: {
        type: Number,
        require: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        require: true,
        default: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Products', productSchema)