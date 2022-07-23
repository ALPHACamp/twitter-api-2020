const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
      if (user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({
            status: 'error',
            message: '無管理員權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      delete user.password
      return res.status(StatusCodes.OK)
        .json({
          status: 'success',
          message: '成功登入',
          token,
          data: user
        })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        include: [
          { model: Tweet, include: { model: Like } },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      users = await users.map(user => ({ ...user.toJSON() }))
      users.forEach(user => {
        user.tweetsCounts = user.Tweets.length
        user.followingsCounts = user.Followings.length
        user.followersCounts = user.Followers.length
        user.likedTweetsCounts = user.Tweets.reduce((prev, next) => prev + next.Likes.length, 0)
        delete user.password
        delete user.Tweets
        delete user.Followings
        delete user.Followers
      })
      users.sort((a, b) => {
        if (a.tweetsCounts === b.tweetsCounts) return (a.id - b.id)
        return (b.tweetsCounts - a.tweetsCounts)
      })
      return res.status(StatusCodes.OK).json(users)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
