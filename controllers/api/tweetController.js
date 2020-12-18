const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const helper = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ include: [User] })
      return res.json({ tweets })
    } catch (error) {
      console.log(error)
    }
  },
  getTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, { include: [User] })
      return res.json({ tweet })
    } catch (error) {
      console.log(error)
    }
  },
  addTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        return res.json({ status: 'error', message: "Content didn't exist" })
      }
      Tweet.create({
        UserId: req.user.id,
        description: req.body.description
      })
      return res.json({ status: 'success', message: 'Tweet was successfully posted' })
    } catch (error) {
      console.log(error)
    }
  },
  updateTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        return res.json({ status: 'error', message: "content didn't exist" })
      }
      const tweet = await Tweet.findByPk(req.params.id)
      if (helper.getUser(req).id !== tweet.dataValues.UserId) {
        return res.json({ status: 'error', message: "You don't have permission to update this tweet" })
      }

      tweet.update({
        description: req.body.description
      })
      return res.json({ status: 'success', message: 'This tweet was successfully update' })
    } catch (error) {
      console.log(error)
    }
  },
  removeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (helper.getUser(req).id !== tweet.dataValues.UserId) {
        return res.json({ status: 'error', message: "You don't have permission to delete this tweet" })
      }
      tweet.destroy()
      return res.json({ status: 'success', message: 'This tweet was successfully remove' })
    } catch (error) {
      console.log(error)
    }
  },
  likeTweet: (req, res) => {

  },
  unlikeTweet: (req, res) => {

  }
}

module.exports = tweetController
