const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')
const Sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req)
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    if (userData.role === 'user') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
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

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: {
          exclude: 'description',
          include: [[Sequelize.literal('SUBSTRING(description, 1, 50)'), 'description']]
        },
        include: [
          { model: User, attributes: { exclude: ['password'] } }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return res.json(tweets)
    } catch (err) {
      return next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        const err = new Error('推文不存在!')
        err.status = 404
        throw err
      }
      const deletedTweet = await tweet.destroy()
      await Reply.destroy({ where: { TweetId: req.params.id } })
      await Like.destroy({ where: { TweetId: req.params.id } })

      return res.json({ status: 'success', data: { deletedTweet } })
    } catch (err) {
      return next(err)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['password'],
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`)'), 'tweetsCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` IN (SELECT `id` FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`))'), 'getLikesCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followerId` = `User`.`id`)'), 'followingsCount']
          ]
        },
        order: [[Sequelize.literal('tweetsCount'), 'DESC']],
        raw: true
      })

      res.json(users)
    } catch (err) {
      return next(err)
    }
  },

  getAuth: (req, res, next) => {
    helpers.getUser(req) ? res.json({ status: 'success', message: `User role is ${helpers.getUser(req).role}` }) : res.status(401).json({ status: 'error', message: 'unauthorized' })
  }
}

module.exports = adminController
