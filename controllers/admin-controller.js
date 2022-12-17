const { User, sequelize, Tweet } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.User_id = User.id)'), 'likeCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']
      ]
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      console.log(userData)
      if (userData.role !== 'admin') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        if (!tweets) throw new Error('There are no Tweets!')
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
