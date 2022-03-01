// const { User, Tweet, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: async (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // Admin only
      if (userData.role !== 'admin') throw new Error('Account or Password is wrong!')
      delete userData.password
      delete userData.introduction
      delete userData.avatar
      delete userData.cover
      delete userData.tweetCount
      delete userData.followerCount
      delete userData.followingCount
      delete userData.likeCount
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          admin: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    console.log('getUser')
  },
  getTweets: async (req, res, next) => {
    console.log('getTweets')
  },
  deleteTweet: async (req, res, next) => {
    console.log('deleteTweet')
  }
}

module.exports = adminController
