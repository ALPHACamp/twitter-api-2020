const { Tweet } = require('../models')
const adminServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { UserId, description} = req.body
    console.log(UserId)
    if (!UserId) throw new Error('UserId is required!')
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Tweet.create({
        UserId, description
      }))
      .then(newTweet => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { Tweet: deletedTweet }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices