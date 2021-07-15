const bcrypt = require('bcryptjs')
const { User, Tweet, Like, Reply, sequelize } = require('../models')
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
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [ sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'
            ), 'likeCount'],
          [ sequelize.literal(
              '(SELECT COUNT(*) FROM Users INNER JOIN Followships ON User.id = Followships.followerId WHERE Followships.followingId = Users.id)'
              ), 'followeingCount' ],
          [ sequelize.literal(
            '(SELECT COUNT(*) FROM Users INNER JOIN Followships ON User.id = Followships.followingId WHERE Followships.followerId = Users.id)'
            ), 'followerCount' ],
          [ sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
            ), 'tweetCount' ],
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']],
      })
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
