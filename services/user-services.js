const { User, Tweet, Like, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const jwt = require('jsonwebtoken')
const userServices = {
  signUp: (req, cb) => {
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('Account already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then((createdUser) => {
        createdUser = createdUser.toJSON()
        delete createdUser.password
        return cb(null, { user: createdUser })
      })
      .catch(err => cb(err))
  },
  signIn: async (req, cb) => {
    try {
      let result = {}
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('All fields are required!')
      }
      const user = await User.findOne({ where: { account } })
      console.log(user);
      if (!user) {
        throw new Error('User not found!')
      } else if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect Account or Password!')
      } else if (user.role !== 'user') {
        throw new Error('請使用一般帳戶登入!')
      } else {
        result = user.toJSON()
      }
      if (result) {
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        delete result.password
        return cb(null, { token, user: result })
      }
    } catch (err) {
      return cb(err)
    }
  },
  getUserTweets: async (req, cb) => {
    try {
      // 找出目標使用者的所有推文及喜歡 回覆數
      const userTweets = await Tweet.findAll({
        where: { userId: req.params.id },
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['account', 'name', 'avatar'] }
        ],
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'likeCount'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'replyCount'
            ]
          ]
        },
        group: ['Tweet.id'],
        order: [['createdAt', 'DESC']]
      })
      // 找出目前使用者喜歡的推文
      const likedTweets = await Like.findAll({
        where: { userId: helper.getUser(req).id },
        attributes: ['tweetId'],
        raw: true
      })
      const likedData = likedTweets.map(data =>
        data.tweetId
      )
      // 目標使用者若無推文
      if (userTweets.length === 0) throw new Error("使用者尚無任何推文")
      const result = userTweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: likedData.includes(tweet.id)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = userServices