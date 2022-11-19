const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

router.post('/googleauth', userCtrl.googleAuthLogin)

router.get('/logout', userCtrl.logout)

router.get('/refresh_token', userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)

router.get('/alluser', auth, authAdmin, userCtrl.getAllUser)

router.put('/updateUser', auth, userCtrl.updateUser)

router.patch('/updatephone', auth, userCtrl.updatePhone)

router.patch('/changepassword', auth, userCtrl.changePassword)

router.post('/forgotpassword', userCtrl.forgotPassword)

router.get('/resetpassword/:id/:token', userCtrl.resetPassword)

router.patch('/updatenewpassword', userCtrl.updateNewPassword)

router.patch('/addcart', auth, userCtrl.addCart)

router.patch('/changestatus/:id', auth, authAdmin, userCtrl.changeStatus)

router.get('/history', auth, userCtrl.history)

router.post('/addstaff', auth, authAdmin, userCtrl.addStaff)

router.post('/verifyphonenumber', auth, userCtrl.verifySmsPhone)

router.post('/verifycodesms', auth, userCtrl.verifyCodeSmsCheck)

module.exports = router