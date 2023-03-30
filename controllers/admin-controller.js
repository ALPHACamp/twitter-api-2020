const { User, Tweet, sequelize } = require('../models')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const helpers = require('../_helpers')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const { password, ...userData } = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw createError(403, 'Access to the requested resource is forbidden')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        token,
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'coverUrl',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM `Tweets` JOIN `Likes` ON `Tweets`.`id` = `Likes`.`Tweet_id` WHERE `Tweets`.`User_id` = `User`.`id`)'
          ),
          'likesNum'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`User_id` = `User`.`id`)'
          ),
          'tweetsNum'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`follower_id` = `User`.`id`)'
          ),
          'followingNum'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`following_id` = `User`.`id`)'
          ),
          'followerNum'
        ]
      ],
      order: [
        [sequelize.literal('TweetsNum'), 'desc'],
        [sequelize.literal('likesNum'), 'desc'],
        [sequelize.literal('followingNum'), 'desc'],
        [sequelize.literal('followerNum'), 'desc']
      ],
      raw: true
    })
      .then(users => {
        res.json(users)
      })
      .catch(error => next(error))
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['created_at', 'desc']],
      raw: true,
      nest: true,
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }]
    })
      .then(tweets => res.json(tweets))
      .catch(error => next(error))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (tweet === null) throw createError(404, "The tweet doesn't exist!")
        return tweet.destroy()
      })
      .then(deleteTweet => res.json(deleteTweet))
      .catch(error => next(error))
  }
}

module.exports = adminController
