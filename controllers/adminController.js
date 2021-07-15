const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Reply } = require('../models')
const jwt = require('jsonwebtoken')

let adminController = {
  signIn: async (req, res, next) => {
    try {
      if (!req.body.account || !req.body.password) {
        throw new Error('請輸入必填項目')
      }
      const user = await User.findOne({
        where: { account: req.body.account }
      })
      if (!user) throw new Error('此使用者尚未註冊')
      if (user.role === 'user') throw new Error('此功能只開放給管理者使用')
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        throw new Error('密碼輸入錯誤')
      }
      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'Login successfully',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          role: user.role
        }
      })
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['name', 'avatar', 'account'] },
        raw: true
      })
      const data = await tweets.map(t => ({
        ...t,
        description: t.description.substring(0, 50)
      }))
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        attributes: { exclude: ['email', 'password', 'introduction', 'role', 'createdAt', 'updatedAt'] },
        include: [
          { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'name'] } },
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
          { model: Like, attributes: ['id'] },
          { model: Reply, attributes: ['id'] }
        ]
      })
      users = await users.map(user => ({
        ...user.dataValues,
        tweetCount: user.Tweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length,
        likeCount: user.Likes.length,
        replyCount: user.Replies.length
      }))
      users = await users.sort((a, b) => b.TweetCount - a.TweetCount)
      return res.json(users)
    } catch (error) {
      next(error)
    }
  },

  deleteTweets: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId)
      if (!tweet) throw new Error("this tweet doesn't exist")
      await tweet.destroy()
      return res.json({ status: 'success', message: 'Successfully delete this tweet' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
