const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')


const adminController = {

  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email }, raw: true })

      if (user.role !== 'admin' || !bcrypt.compareSync(password, user.password)) {
        return res.status(403).json({
          status: 'error',
          message: '信箱和密碼錯誤。'
        })
      }

      return res.json({
        status: 'success',
        message: `成功登入！歡迎 ${user.role} ${user.name}.`,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })

    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        attributes: { exclude: ['updatedAt'] }
      })
      // change to timestamp
      tweets.map(element => {
        element.createdAt = element.createdAt.getTime()
        return element
      })
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (tweet) {
        await tweet.destroy()
      }

      return res.json({ status: 'success', message: '刪除成功' })
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const validFilterList = ['followingsCount', 'followersCount', 'likesCount'] // default=tweetsCount
      let orderBy = 'tweetsCount'
      if (req.params.order && validFilterList.includes(req.params.order)) orderBy = req.params.order

      const users = await User.findAll({
        where: { role: null },
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetsCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingsCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followersCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)'), 'likesCount'],
          ],
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
        order: [
          [sequelize.literal(orderBy), 'DESC'],
          [sequelize.literal('id'), 'ASC']
        ],
        // limit: 10,
        raw: true,
        nest: true,
      })
      return res.json(users)
    } catch (error) {
      next(error)
    }
  },

}

module.exports = adminController