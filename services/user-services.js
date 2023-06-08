const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const {
    User,
    Tweet,
    Followship
} = db

const userServices = {
    signIn: (req, cb) => {
        try {
            const userData = req.user.toJSON()
            delete userData.password
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
            cb(null, {
                token,
                user: userData
            })
        } catch (err) {
            cb(err)
        }
    },
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
            .catch(err => cb(err))
    },
    getUser: (req, cb) => {
        return Promise.all([
            User.findByPk(req.params.id, { raw: true }),
            Tweet.findAll({
                raw: true,
                nest: true,
                where: {
                    UserId: req.params.id
                }
            }),
            Followship.findAll({
                raw: true,
                nest: true,
                where: {
                    followerId: req.params.id
                }
            }),
            Followship.findAll({
                raw: true,
                nest: true,
                where: {
                    followingId: req.params.id
                }
            })
        ])
            .then(([user, tweets, followings, followers]) => {
                if (!user) throw new Error("User didn't exist!")
                delete user.password
                cb(null, {
                    user,
                    followingCount: followings.length,
                    followerCount: followers.length,
                    tweetCount: tweets.length
                })
            })
            .catch(err => cb(err))
    }
}

module.exports = userServices