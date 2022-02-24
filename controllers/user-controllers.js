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
            const isFollowing = targetUser.Followers.some(f => f.id === req.user.id)
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
    },
    getTopUsers: async (req, res, next) => { 
        try {
            const users = await User.findAll({
                include: { 
                    model: User, as: 'Followers' ,
                }
            })
            const result = users
                .map(user => ({
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    followerCount: user.Followers.length,
                    isFollowing: req.user.Followings.some(f => f.id === user.id)
                }))
                .sort((a, b) => b.followerCount - a.followerCount)
                // .slice(0, 10)
            
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }

}

module.exports = userController
