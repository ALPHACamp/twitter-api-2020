const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

const userController = {
    signUp: async (req, res, next) => {
        if (req.body.password !== req.body.checkPassword) return res.json({ status: 'error', message: 'Passwords do not match!' })
        if (!req.body.email || !req.body.account || !req.body.name) return res.json({ status: 'error', message: 'All fields are required' })
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
                .then(() => {
                    {
                        res.json({ status: 'success' })
                    }
                })
        } catch (err) { next(err) }
    },
    getUser: async (req, res, next) => {
        try {
            const targetUser = await User.findByPk(req.params.id, {
                include: [
                    { model: User, as: 'Followers' },
                ]
            })
            if (!targetUser) {
                return res.json({ status: 'error', message: "User didn't exist!" })
            }
            const { account, name, email, introduction, avatar, cover } = targetUser
            const isFollowing = req.user.Followings.some(f => f.id === targetUser.id)
            return res.json({ 
                account,
                name,
                email,
                introduction,
                avatar,
                cover,
                isFollowing
            })

        } catch (err) {
            next(err)
        }
    },
    getUserTweets: async (req, res, next) => { 
        try {
            const user = await User.findByPk(req.params.id)
            if (!user) {
                return res.json({ status: 'error', message: "User didn't exist!" })
            }
            const tweets = await Tweet.findAll({
                where: { UserId: req.params.id},
                nest: true,
                raw: true
            })
            return res.json(tweets)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = userController
