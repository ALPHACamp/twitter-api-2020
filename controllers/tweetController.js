
const db = require('../models')
const userService = require('../services/userService')

const tweetController = {
  getTweets: (req, res) => {
    userService.getTweets(req, res, (data) => {
      return res.render('tweets', data)
    })
  }
}

module.exports = tweetController
