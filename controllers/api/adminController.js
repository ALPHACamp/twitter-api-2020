const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')


const adminController = {

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account: account }, raw: true })

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(403).json({
          status: 'error',
          message: 'Invalid email or password.'
        })
      }

      return res.json({
        status: 'success',
        message: `Successfully login. Welcome ${user.role} ${user.name}.`,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
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
      return res.json({ tweets })
    } catch (error) {
      next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      await tweet.destroy()

      return res.json({ status: 'success', message: 'Delete successfully.' })
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
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
          [sequelize.literal('tweetsCount'), 'DESC']
        ],
        // limit: 10,
        raw: true,
        nest: true,
      })
      return res.json({ status: 'success', users })
    } catch (error) {
      next(error)
    }
  },

}

module.exports = adminController