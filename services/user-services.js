const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const {
    User
} = db

const userServices = {
    signUp: (req, cb) => {
        User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
            if (user) throw new Error('Email already exists!')

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            return User.create({
              name: req.body.name,
              email: req.body.email,
              password: hash
            })
        })
            .then(newUser => cb(null, {
            user: newUser
        }))
            .
        catch (err => cb(err))
    }
}

module.exports = userServices