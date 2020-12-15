const db = require('../../models')
const Tweet = db.Tweet

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll()
      return res.json({ tweets })
    } catch (error) {
      console.log(error)
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      return res.json({ tweet })
    } catch (error) {
      console.log(error)
    }
  },
  addTweet: (req, res) => {

  },
  updateTweet: (req, res) => {

  },
  removeTweet: (req, res) => {

  },
  likeTweet: (req, res) => {

  },
  unlikeTweet: (req, res) => {

  }
}

module.exports = tweetController
