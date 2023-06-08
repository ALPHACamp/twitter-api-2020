const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const {
    User,
    Tweet,
    Followship
} = db

const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

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
        User.findAll()
            .then(users => {
                if (users.length > 0) {
                    const existingAccount = users.find(user => user.account === account)
                    const existingEmail = users.find(user => user.email === email)
                    if (existingAccount) {
                        throw new Error('帳號已存在！')
                    } else if (existingEmail) {
                        throw new Error('信箱已存在！')
                    }
                }
                if (name.length >= 50) throw new Error('名稱不可超過50字！')
                if (password !== confirmPassword) throw new Error('密碼與確認密碼不一致！')
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)
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
        const { id } = req.params
        return Promise.all([
            User.findByPk(req.params.id, { raw: true }),
            Tweet.count({
                where: {
                    UserId: id
                }
            }),
            Followship.count({
                where: {
                    followerId: id
                }
            }),
            Followship.count({
                where: {
                    followingId: id
                }
            })
        ])
            .then(([user, tweets, followings, followers]) => {
                if (!user) throw new Error("使用者不存在！")
                delete user.password
                cb(null, {
                    ...user,
                    followingCount: followings,
                    followerCount: followers,
                    tweetCount: tweets
                })
            })
            .catch(err => cb(err))
    },
    getUserTweets: (req, cb) => {
        const { id } = req.params
        return Tweet.findAll({
            raw: true,
            nest: true,
            include: User,
            where: {
                UserId: id
            }
        })
            .then((tweets) => {
                const newData = tweets.map(tweet => {
                    tweet.createdAt = dayjs().to(tweet.createdAt)
                    delete tweet.User.password
                    return tweet
                })
                cb(null, newData)
            })
            .catch(err => cb(err))
    },
}

module.exports = userServices