const router = require('express').Router()
const productsCtrl = require('../controllers/productsCtrl')
const auth = require('../middleware/auth')

router.route('/products')
    .get(productsCtrl.getProducts)
    .post(productsCtrl.createProduct)

router.route('/products/:id')
    .delete(productsCtrl.deleteProduct)
    .put(productsCtrl.updateProduct)
    
router.route('/products/:id/changepublish')    
    .patch(productsCtrl.changePublish)

router.route('/products/:id/review')
    .post(auth, productsCtrl.createReview)

router.route('/productsHomepage')
    .get(productsCtrl.getProductsQuery)

module.exports = router