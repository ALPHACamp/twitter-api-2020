const bcrypt = require('bcryptjs')
//const { User, Tweet, Reply, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
//之後加'../helpers/file-helpers'

const adminController = {
    signIn: (req, res, next) => {
        try{
            const token = jwt.sign(req.user, process.env.JWT_SECRET, {expiresIn: '30d' })
            res.json({ status: 'success', token })
        } catch(err) {
            next(err)
        }
    },
}

module.exports = adminController
