const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/payment')
    .get(auth, authAdmin, paymentCtrl.getPayments)
    .post(auth, paymentCtrl.createPayment)

router.route('/paymentCOD')
    .post(auth, paymentCtrl.createPaymentCOD)

router.route('/payment/changestatus/:id')
    .patch(auth, authAdmin, paymentCtrl.changeStatusOrder)
    .put(auth, authAdmin, paymentCtrl.setpaidOrder)

router.route('/payment/cancel/:id')
    .patch(auth, paymentCtrl.cancelOrder)

router.route('/payment/changeaddress/:id')
    .patch(auth, paymentCtrl.changeAddress)

router.route('/payment/changephonenumber/:id')
    .patch(auth, paymentCtrl.changePhoneNumber)
    
module.exports = router