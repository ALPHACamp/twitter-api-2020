const db = require('../models')
const Tweet = db.Tweet
// const imgur = require('imgur-node-api')
// const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  // Tweets
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      raw: true,
      nest: true
    }).then(tweets => {
      callback({ tweets: tweets })
    })
  }
}

module.exports = userService
