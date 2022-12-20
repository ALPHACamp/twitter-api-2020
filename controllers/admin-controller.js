const jwt = require('jsonwebtoken')
const { User, sequelize, Tweet } = require('../models')
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
      ],
      order: [[sequelize.literal('tweetCount'), 'DESC']]
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },

  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') res.status(404).json({ status: 'error', message: '帳號不存在!' })
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
        if (!tweets) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50),
          createdAt: helpers.relativeTime(t.createdAt)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },

  deleteTweets: (req, res, next) => {
    const tweetId = Number(req.params.id)
    return Tweet.destroy({
      where: { id: tweetId }
    })
      .then(deletedTweet => {
        if (!deletedTweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        return res.status(200).json({ status: 'success', message: '貼文已刪除!' })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
