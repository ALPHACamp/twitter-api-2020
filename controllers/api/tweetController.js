const db = require('../../models')
const userService = require('../../services/userService')

const tweetController = {
  getTweets: (req, res) => {
    userService.getTweets(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = tweetController
