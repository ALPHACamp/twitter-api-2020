const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
    signUp: async (req, res, next) => {
        if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
        try {
            const email = await User.findOne({ where: { email: req.body.email } })
            const account = await User.findOne({ where: { account: req.body.account } })
            if (email) return res.json({ status: 'error', message: 'email already existed' })
            if (account) return res.json({ status: 'error', message: 'account already existed' })
            return bcrypt.hash(req.body.password, 10)
                .then(hash => 
                    User.create({
                    name: req.body.name,
                    account: req.body.account,
                    email: req.body.email,
                    password: hash,
                    isAdmin: false
                }))
                .then(() => {{
                    res.json({ status: 'success'})
                }})
        } catch (err) { next(err) }
    }
}

module.exports = userController
