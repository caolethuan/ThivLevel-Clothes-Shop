const Users = require('../models/userModels')
const Payments = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const twilioConfig = require('./twilioConfig')
const otp = require('twilio')(twilioConfig.accountSID, twilioConfig.authToken)


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString } //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['sort']
        excludedFields.forEach(el => delete (queryObj[el]))

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
    sorting() {

        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
}

const userCtrl = {
    register: async (req, res) => {
        try {
            const { username, email, password, verify_password } = req.body;
            if (!ValidateEmail(email)) return res.status(400).json({ msg: "Email không hợp lệ" })
            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "Email này đã được đăng ký" })

            if (password.length < 6)
                return res.status(400).json({ msg: 'Mật khẩu tổi thiểu 6 ký tự' })
            if (password !== verify_password)
                return res.status(400).json({ msg: 'Xác nhận mật khẩu chưa đúng' })

            //Password Encrypt
            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                username, email, password: passwordHash
            })

            //save to database
            await newUser.save()

            //Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({ accesstoken })
            // res.json({msg: "Register success!"})

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            if (!user.status) return res.status(400).json({ msg: "This account has been locked." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Incorrect Password." })

            //If login success, create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({ accesstoken })
        } catch (err) {

            return res.status(500).json({ msg: err.message })

        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: 'Logged out' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please Login or Register" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ user, accesstoken })
            })

            res.json({ rf_token })
        } catch (err) {

        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if (!user) return res.status(400).json({ msg: 'User does not exist.' })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllUser: async (req, res) => {
        try {
            const allUser = await Users.find(req.query)

            res.json(allUser)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { username, email, address, gender, dateOfbirth, imageProfile } = req.body;

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                username, email, address, gender, dateOfbirth, imageProfile
            })

            res.json('Updated your profile')

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updatePhone: async (req, res) => {
        try {
            const { phone } = req.body;
            if (phone.length < 9) return res.status(400).json({ msg: 'Số điện thoại không hợp lệ.' })
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                phone, isVerifyPhone: false
            })

            res.json('Updated your phone')

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            if (!user) return res.status(400).json({ msg: "User does not exist." })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })

            return res.json({ msg: "Added to cart" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    history: async (req, res) => {
        try {
            const features = new APIfeatures(Payments.find({ user_id: req.user.id }), req.query).filtering().sorting()
            const history = await features.query
            // const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleAuthLogin: async (req, res) => {
        try {
            const { name, email, imageUrl, accessToken } = req.body;
            const user = await Users.findOne({ email })
            if (user) {

                //Password Encrypt
                const passwordHash = await bcrypt.hash(accessToken, 10)

                await Users.findOneAndUpdate({ email }, {
                    password: passwordHash
                })
                //If login success, create access token and refresh token
                const accesstoken = createAccessToken({ id: user._id })
                const refreshtoken = createRefreshToken({ id: user._id })

                res.cookie('refreshtoken', refreshtoken, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                })
                res.json({ accesstoken })
                return;
            }

            //Password Encrypt
            const passwordHash = await bcrypt.hash(accessToken, 10)

            const newUser = new Users({
                username: name, email, imageProfile: imageUrl ,password: passwordHash, isLogSocialNetwork: true,
            })

            //save to database
            await newUser.save()

            //Then create jsonwebtoken to authentication
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            res.json({ accesstoken })
            // res.json({msg: "Register success!"})

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    changePassword: async (req, res) => {
        try {
            const { oldPassword, newPassword, verifyPassword } = req.body;

            const user = await Users.findOne({ _id: req.user.id })

            if (!user) return res.status(400).json({ msg: "User does not exist." })

            const isMatch = await bcrypt.compare(oldPassword, user.password)

            if (!isMatch) return res.status(400).json({ msg: "Mật khẩu hiện tại chưa đúng" })

            if (oldPassword === newPassword)
                return res.status(400).json({ msg: "Mật khẩu mới không được trùng với mật khẩu hiện tại" })
            if (newPassword.length < 6)
                return res.status(400).json({ msg: 'Mật khẩu có ít nhất 6 ký tự' })
            if (newPassword !== verifyPassword)
                return res.status(400).json({ msg: 'Xác nhận mật khẩu chưa đúng' })
            //Password Encrypt
            const passwordHash = await bcrypt.hash(newPassword, 10)

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })

            return res.json({ msg: "Đổi mật khẩu thành công" })


        } catch (err) {

            return res.status(500).json({ msg: err.message })

        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const oldUser = await Users.findOne({ email })
            if (!oldUser) {
                return res.status(400).json({ msg: 'User Not Exists.' })
            }
            const secret = process.env.CHANGE_PASSWORD_SECRET + oldUser.password
            const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '5m' })
            const link = `${process.env.LINK_TO_RESET_PASSWORD}/${oldUser._id}/${token}`
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_USERNAME, // generated ethereal user
                    pass: process.env.MAIL_PASSWORD_APP, // generated ethereal password
                },
            });

            // send mail with defined transport object
            await transporter.sendMail({
                from: 'vt.shop@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Your password reset link", // Subject line
                text: link, // plain text body
                // html: "<b>Hello world?</b>", // html body
            });

            res.json({ msg: 'An email with instructions for resetting your password has been sent to your email' })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        const { id, token } = req.params
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const oldUser = await Users.findOne({ _id: id })
            if (!oldUser) {
                return res.status(400).json({ msg: 'User Not Exists.' })
            }

            const secret = process.env.CHANGE_PASSWORD_SECRET + oldUser.password
            try {
                jwt.verify(token, secret)
                res.json({ msg: 'Verified' })
            } catch (err) {
                res.status(500).json({ msg: err.message })
            }
        } else return res.status(400).json({ msg: 'Invalid Token' })
    },
    updateNewPassword: async (req, res) => {
        // const {id, token} = req.params
        const { id, token, password } = req.body
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const oldUser = await Users.findOne({ _id: id })

            if (!oldUser) {
                return res.status(400).json({ msg: 'User Not Exists.' })
            }
            const secret = process.env.CHANGE_PASSWORD_SECRET + oldUser.password
            try {
                jwt.verify(token, secret)
                if (password.length < 6) return res.status(400).json({ msg: 'Password is at least 6 characters long.' })
                const hashPassword = await bcrypt.hash(password, 10)
                await Users.findOneAndUpdate({ _id: id }, {
                    password: hashPassword
                })
                res.json({ msg: 'Password Updated' })
            } catch (err) {
                res.status(500).json({ msg: err.message })
            }
        } else return res.status(400).json({ msg: 'Invalid Token' })
    },
    changeStatus: async (req, res) => {
        try {
            const { status } = req.body

            await Users.findOneAndUpdate({ _id: req.params.id }, {
                status
            })

            return res.json({ msg: "User status is changed." })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addStaff: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            if (!ValidateEmail(email)) return res.status(400).json({ msg: "You have entered an invalid email address!" })
            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "The email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: 'Password is at least 6 characters long.' })

            //Password Encrypt
            const passwordHash = await bcrypt.hash(password, 10)

            const newUser = new Users({
                username, email, password: passwordHash, role: 1
            })

            //save to database
            await newUser.save()

            return res.json({ msg: "New Staff is created." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    verifySmsPhone: async (req, res) => {
        try {
            const { phone } = req.body
            if (phone.length !== 9) return res.status(400).json({ msg: 'Số điện thoại không hợp lệ' })
            const verifySms = await otp.verify.services(twilioConfig.serviceID).verifications.create({
                to: `+84${phone}`,
                channel: 'sms'
            })

            return res.json({ msg: 'Chúng tôi đã gửi mã OTP đến số điện thoại của bạn' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    verifyCodeSmsCheck: async (req, res) => {
        try {
            const { phone, code } = req.body
            const verificationCheck = await otp.verify.services(twilioConfig.serviceID).verificationChecks.create({
                to: `+84${phone}`,
                code: code
            })

            if (verificationCheck.status !== 'approved') {
                return res.status(400).json({ msg: 'Mã OTP không chính xác!' })
            }

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                isVerifyPhone: true,
            })

            return res.json({ msg: 'Xác thực thành công!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}
const ValidateEmail = (email) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}
const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl