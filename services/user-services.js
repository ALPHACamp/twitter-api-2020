const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const {
    User
} = db

const userServices = {
    signUp: (req, cb) => {
        const { name, account, email, password, confirmPassword } = req.body
        User.findOne({
            where: {
                account
            }
        })
            .then(user => {
                if (user) throw new Error('帳號已存在！')
                if (name.length >= 50) throw new Error('名稱不可超過50字！')
                if (password !== confirmPassword) throw new Error('密碼與確認密碼不一致！')
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                return User.create({
                    name,
                    account,
                    email,
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