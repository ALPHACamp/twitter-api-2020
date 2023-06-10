const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { getUserData } = require('../helpers/getUserData')

const {
    User,
    Tweet,
    Followship,
    Like,
    Reply
} = require('../models')

// const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userServices = {
    signIn: async (req, cb) => {
        try {
            const { account, password } = req.body
            if (!account || !password) throw new Error('請輸入帳號和密碼！')

            const user = await User.findOne({
                where: { account }
            })
            if (!user) throw new Error('帳號不存在！')
            if (user.role === 'admin') throw new Error('帳號不存在！')
            if (!bcrypt.compareSync(password, user.password)) throw new Error('帳密錯誤！')
            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
            const userData = user.toJSON()
            delete userData.password
            return cb(null, {
                status: 'success',
                message: '登入成功！',
                token,
                user: userData
            })
        } catch (err) {
            cb(err)
        }
    },
    signUp: async (req, cb) => {
        try {
            const { name, account, email, password, checkPassword } = req.body
            const users = await User.findAll()
            if (users.length > 0) {
                const existingAccount = users.find(user => user.account === account)
                const existingEmail = users.find(user => user.email === email)
                if (existingAccount) {
                    throw new Error('帳號已存在！')
                } else if (existingEmail) {
                    throw new Error('信箱已存在！')
                }
            }
            if (!name) throw new Error('請填入名稱！')
            if (name.length >= 50) throw new Error('名稱不可超過50字！')
            if (password !== checkPassword) throw new Error('密碼與確認密碼不一致！')
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const newUser = await User.create({
                name,
                account,
                email,
                role: 'user',
                password: hash
            })
            const userData = newUser.toJSON()
            delete userData.password
            cb(null, {
                status: 'success',
                message: '註冊成功！',
                user: userData
            })
        } catch (err) {
            cb(err)
        }
    },
    getUser: (req, cb) => {
        const { id } = req.params
        return Promise.all([
            User.findByPk(id, {
                raw: true
            }),
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
    getUserTweets: async (req, cb) => {
        try {
            const { id } = req.params
            let tweets = await Tweet.findAll({
                where: { UserId: id },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'avatar', 'account']
                    }, {
                        model: Like
                    }, {
                        model: Reply
                    }],
                order: [['createdAt', 'DESC']]
            })

            if (!tweets) throw new Error("目前沒有任何推文！")
            const userLikedTweetsId = getUserData(req.user.LikedTweets)

            tweets = tweets.map(tweet => ({
                ...tweet.dataValues,
                isLiked: userLikedTweetsId.length ? userLikedTweetsId.includes(tweet.id) : false,
                replyCount: tweet.Replies.length,
                likeCount: tweet.Likes.length
            }))
            cb(null, tweets)
        } catch (err) {
            cb(err)
        }
    },
    putUser: (req, cb) => {
        const { id } = req.params
        const { name, account, email, password, checkPassword, introduction } = req.body
        const { files } = req
        if (password !== checkPassword) throw new Error('密碼與確認密碼不一致！')
        if (!name) throw new Error('請填入名稱！')
        if (name.length >= 50) throw new Error('名稱不可超過50字！')
        if (introduction.length >= 160) throw new Error('自我介紹不可超過160字！')

        return Promise.all([
            User.findAll({
                raw: true,
                where: { id: { [Op.ne]: id } } // 找出除了使用者本人以外的所有使用者
            }),
            User.findByPk(id),
            imgurFileHandler(files)
        ])
            .then(([allUsers, user, filePath]) => {
                if (allUsers.length > 0) {
                    const existingAccount = allUsers.find(user => user.account === account)
                    const existingEmail = allUsers.find(user => user.email === email)
                    if (existingAccount) {
                        throw new Error('帳號已存在！')
                    } else if (existingEmail) {
                        throw new Error('信箱已存在！')
                    }
                }
                if (!user) throw new Error("使用者不存在！")
                if (user.id !== Number(id)) throw new Error('只能編輯自己的使用者資料！')
                user.update({
                    name,
                    account,
                    email,
                    introduction,
                    avatar: filePath[0] || user.avatar,
                    banner: filePath[1] || user.banner
                })
                    .then(updateUser => {
                        const userData = updateUser.toJSON()
                        delete userData.password
                        cb(null, userData)
                    })
                    .catch(err => {
                        cb(err)
                    })
            })
            .catch(err => {
                cb(err)
            })
    }
}

module.exports = userServices