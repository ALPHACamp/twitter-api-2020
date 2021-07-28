const db = require('../models')
const { User, Tweet, Like, Reply, Sequelize } = db
const { Op } = require('sequelize')

const tweetService = require('../services/tweetService')
const adminService = require('../services/adminService')

const adminController = {
  getUsers: async (req, res) => {
    try {
      const data = await adminService.getUsers()

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  deleteTweet: async (req, res) => {
    const tweetId = req.params.id

    try {
      const data = await adminService.deleteTweet(tweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getTweets: (req, res) => {
    const viewerId = req.user.id

    tweetService.getTweets(viewerId, 'admin')
      .then(data => {
        return res.status(200).json(data)
      })
  }
}

module.exports = adminController
