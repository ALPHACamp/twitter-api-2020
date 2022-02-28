const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const validator = require('validator')
const uploadFile = require('../helpers/file')
const helpers = require('../_helpers')
const { getFollowshipId, getLikedTweetsIds } = require('../helpers/user')
const userServices = require('../services/user-service')

const userController = {
  login: async (req, res, next) => {
    const { email, password } = req.body

    try {
      const { status, data } = await userServices.login(email, password)

      return res.json({ status, data })
    } catch (error) {
      next(error)
    }
  },

  // User sign up for new account
  register: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    try {
      const newUser = await userServices.register(account, name, email, password, checkPassword)

      return res.json({ newUser })
    } catch (error) {
      next(error)
    }
  },

  // Get basic user info
  getUser: async (req, res, next) => {
    try {
      const user = await userServices.getUser(req)

      return res.json(user)
    } catch (error) {
      next(error)
    }
  },

  // Edit user profile
  putUser: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    const id = req.params.id
    const { files } = req
    const { email, password, name, account, introduction } = req.body
    try {
      const { status, message } = await userServices.putUser(userId, id, files, email, password, name, account, introduction)

      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },

  // Get top 10 users
  getTopUsers: async (req, res, next) => {
    try {
      let topUsers = await User.findAll({
        where: { role: 'user' },
        attributes: {
          exclude: ['password']
        },
        order: [['followerCount', 'DESC']],
        limit: 10,
        raw: true
      })

      const followingIds = getFollowshipId(req, 'Followings')

      // Clean data
      topUsers = topUsers.map(user => ({
        ...user,
        isFollowed: followingIds.includes(user.id)
      }))

      return res.status(200).json(topUsers)
    } catch (error) {
      next(error)
    }
  },

  // Get all tweets from specific user
  getUserTweets: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      let [tweets, userLikes] = await Promise.all([
        Tweet.findAll({
          where: { UserId: req.params.id },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ],
          raw: true,
          nest: true
        }),
        Like.findAll({
          where: { UserId: user.id },
          raw: true
        })
      ])

      // Clean like data
      userLikes = userLikes.map(like => like.TweetId)

      // Clean like data
      tweets = tweets.map(tweet => ({
        ...tweet,
        isLiked: userLikes.includes(tweet.id)
      }))

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },

  // Get all replied tweets by specific user
  getUserRepliedTweet: async (req, res, next) => {
    try {
      let replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
            ]
          }
        ],
        raw: true,
        nest: true
      })

      const userLikes = await getLikedTweetsIds(req)

      replies = replies.map(reply => ({
        ...reply,
        likedTweet: userLikes.includes(reply.Tweet.id)
      }))

      return res.status(200).json(replies)
    } catch (error) {
      next(error)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      let likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [
              { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
            ]
          }
        ],
        raw: true,
        nest: true
      })

      // Clean data
      likes = likes.map(like => ({
        ...like,
        likedTweet: true
      }))

      return res.status(200).json(likes)
    } catch (error) {
      next(error)
    }
  },

  // Just for test, data included in GET api/users/:id
  getUserFollowings: async (req, res, next) => {
    try {
      const followings = await Followship.findAll({
        where: { followerId: req.params.id }
      })

      return res.status(200).json(followings)
    } catch (error) {
      next(error)
    }
  },

  // Just for test, data included in GET api/users/:id
  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { followingId: req.params.id }
      })

      return res.status(200).json(followers)
    } catch (error) {
      next(error)
    }
  },

  // Get current user info
  getCurrentUser: async (req, res, next) => {
    try {
      let user = helpers.getUser(req)
      user = await User.findById(user.id, {
        raw: true
      })

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
