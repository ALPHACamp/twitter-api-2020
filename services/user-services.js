const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const {
    User
} = db

const userServices = {
    signUp: (req, cb) => {
        User.findOne({
            where: {
                account: req.body.account
            }
        })
            .then(user => {
                if (user) throw new Error('Account already exists!')
                if (req.body.name.length >= 50) throw new Error('50 words restriction')
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.password, salt);
                return User.create({
                    name: req.body.name,
                    account: req.body.account,
                    email: req.body.email,
                    role: 'user',
                    password: hash
                })
            })
            .then(newUser => cb(null, {
                user: newUser
            }))
            .
            catch(err => cb(err))
    }
}

module.exports = userServices