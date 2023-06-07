const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//之後加'../helpers/file-helpers'

const userController = {
    register: (req, res, next) => {
        User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) throw new Error('Email already exists!')

            return bcrypt.hash(req.body.password, 10)
        })
        .then(hash => User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
        }))
        .then(() => {
            req.flash('success_messages', '成功註冊帳號！')
            res.redirect('/signin')
        })
        .catch(err => next(err))
    },
    signIn: (req, res, next) => {
        try{
            const userData = req.user.toJSON()
            delete userData.password

            const token = jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '30d' })
            return res.json({ 
                status: 'success',
                data: {
                    token,
                    user: userData
                } })
        } catch(err) {
            next(err)
        }
    },
    signInPage: (req, res, next) => {
        res.send('Hello World!')
    }
}

module.exports = userController
