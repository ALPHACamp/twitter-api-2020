const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
            ),
            'tweetsAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id))'
            ),
            'likesAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
            ),
            'followingsAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersAmount'
          ]
        ],
        order: [
          [sequelize.literal('tweetsAmount'), 'DESC'],
          [sequelize.literal('likesAmount'), 'DESC'],
          [sequelize.literal('followingsAmount'), 'DESC'],
          [sequelize.literal('followersAmount'), 'DESC']
        ],
        nest: true,
        raw: true
      })

      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('此推文不存在！')

      await Promise.all([
        tweet.destroy(),
        Reply.destroy({ where: { TweetId: tweet.id } }),
        Like.destroy({ where: { TweetId: tweet.id } })
      ])

      return res.status(200).json({
        status: 'success',
        message: '成功刪除推文！',
        tweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
