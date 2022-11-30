const Payments = require('../models/paymentModel')
const Users = require('../models/userModels')
const Products = require('../models/productsModel')


class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['sort']
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

}

const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const features = new APIfeatures(Payments.find(), req.query).filtering().sorting()
            const payments = await features.query
            // const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) 
                return res.status(400).json({msg: 'User does not exist.'})
            
            const {cart, paymentID, name, phone, address, total, method, isPaid} = req.body;
            const {_id, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address, total, phone, method, isPaid
            })

            // cart.filter(item => {
            //     return sold(item._id, item.quantity, item.sold)
            // })

            const groupBy = function(xs, id) {
                return xs.reduce(function(rv, x) {
                  (rv[x[id]] = rv[x[id]] || []).push(x);
                  return rv;
                }, {});
            };

            const groupByItem = groupBy(cart, 'product_id')

            Object.keys(groupByItem).forEach(id => {
                const sumQuantity = groupByItem[id].reduce((acc, curr) => {
                  return acc + curr.quantity
                },0)  
                return sold(id, sumQuantity)
            });
            
            await newPayment.save()
            res.json({msg: 'Payment success.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createPaymentCOD: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if(!user) 
                return res.status(400).json({msg: 'User does not exist.'})
            
            const {cart, name, phone, address, total, method, isPaid} = req.body;
            const {_id, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, address, total, phone, method, isPaid
            })

            // cart.filter(item => {
            //     return sold(item._id, item.quantity, item.sold)
            // })

            const groupBy = function(xs, id) {
                return xs.reduce(function(rv, x) {
                  (rv[x[id]] = rv[x[id]] || []).push(x);
                  return rv;
                }, {});
            };

            const groupByItem = groupBy(cart, 'product_id')

            Object.keys(groupByItem).forEach(id => {
                const sumQuantity = groupByItem[id].reduce((acc, curr) => {
                  return acc + curr.quantity
                },0)  
                return sold(id, sumQuantity)
            });
            
            await newPayment.save()
            res.json({msg: 'Payment success.'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changeStatusOrder: async (req, res) => {
        try {
            const { status } = req.body
            
            await Payments.findOneAndUpdate({_id: req.params.id}, {
                status
            })

            return res.json({msg: "Order status is updated."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    setpaidOrder: async (req, res) => {
        try {
            const { isPaid, status } = req.body
            
            await Payments.findOneAndUpdate({_id: req.params.id}, {
                isPaid, status
            })

            return res.json({msg: "Order payment is updated."})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelOrder: async (req, res) => {
        try {

            const { cancel } = req.body
            const payment = await Payments.findById(req.params.id)

            const { status, cart } = payment

            if(status === 'Shipping' || status === 'Delivered') return res.status(400).json({msg: 'Đơn hàng này không thể hủy.'})
            if(status === 'Cancel') return res.status(400).json({msg: 'Bạn đã hủy đơn hàng này rồi.'})

            const groupBy = function(xs, id) {
                return xs.reduce(function(rv, x) {
                  (rv[x[id]] = rv[x[id]] || []).push(x);
                  return rv;
                }, {});
            };

            const groupByItem = groupBy(cart, 'product_id')

            Object.keys(groupByItem).forEach(id => {
                const sumQuantity = groupByItem[id].reduce((acc, curr) => {
                  return acc + curr.quantity
                },0)  
                return resold(id, sumQuantity)
            });

            await Payments.findOneAndUpdate({_id: req.params.id}, {
                status : cancel
            })
            
            return res.json({msg: "Order payment is updated."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changeAddress: async (req, res) => {
        try {
            const { address } = req.body

            await Payments.findOneAndUpdate({_id: req.params.id}, {
                address
            })

            return res.json({msg: "Order address is changed."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    changePhoneNumber: async (req, res) => {
        try {
            const { newPhone } = req.body

            await Payments.findOneAndUpdate({_id: req.params.id}, {
                phone: newPhone
            })

            return res.json({msg: "Order phone number is changed."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const sold = async(id, quantity) => {
    const product = await Products.findOne({product_id: id})
    const oldSold = product.sold
    const inStock = product.countInStock
    await Products.findOneAndUpdate({product_id: id}, {
        sold: quantity + oldSold, countInStock: inStock - quantity
    })
}

const resold = async(id, quantity) => {
    const product = await Products.findOne({product_id: id})
    const oldSold = product.sold
    const inStock = product.countInStock
    await Products.findOneAndUpdate({product_id: id}, {
        sold: oldSold - quantity, countInStock: inStock + quantity
    })
}
module.exports = paymentCtrl