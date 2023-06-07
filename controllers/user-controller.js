const bcrypt = require('bcryptjs')
const { User } = require('../models/user')
const jwt = require('jsonwebtoken')
//之後加'../helpers/file-helpers'

const userController = {
    register: (req, res, next) => {
        if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

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
            const token = jwt.sign(req.user, process.env.JWT_SECRET, {expiresIn: '30d' })
            res.json({ 
                status: 'success',
                data: {
                    token,
                    user: req.user
                } })
        } catch(err) {
            next(err)
        }
    },
}

module.exports = userController
