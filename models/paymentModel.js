const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    user_id:  {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    paymentID: {
        type: String,
        require: true
    },
    address: {
        type: Object,
        require: true
    },
    phone: {
        type: String
    },
    total: {
        type: Number,
        require: true
    },
    method: {
        type: String       
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default: 'Pending'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Payments', paymentSchema)