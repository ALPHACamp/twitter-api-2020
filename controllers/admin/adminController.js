
const { Tweet, User, Like } = require('../../models')
const assert = require('assert')
const helpers = require('../../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  adminSignIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          data: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },
  getAllTweets: async (req, res, next) => {
    try {
      let data = await Tweet.findAll({
        include: User,
        // where: { role: 'user' },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      data = data.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      res.json(data)
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id)
      assert(tweet, '貼文不存在')
      const deleted = await tweet.destroy()
      res.json(deleted)
    } catch (error) {
      next(error)
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      let [userData, tweetData, likeData] = await Promise.all([
        User.findAll({
          include: [
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        }),
        Tweet.findAll({
          raw: true
        }),
        Like.findAll({
          raw: true
        })
      ])
      userData = userData.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        tweetCount: tweetData.filter(tweet => tweet.UserId === user.id).length,
        likeCount: likeData.filter(like => like.UserId === user.id).length
      }))
      userData = userData.sort((a, b) => b.tweetCount - a.tweetCount)
      return res.json(userData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
