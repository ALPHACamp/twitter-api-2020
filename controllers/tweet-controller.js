const { Tweet, User, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        res.json( tweet )
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Reply.findAll({
      where: {tweetId}
    })
      .then(replies => {
        res.json(replies)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    if (!description) throw new Error('Description text is required!')
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          userId
        })
      })
      .then(tweets => {
        res.json({
          status: 'success',
          data: tweets
        })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => {
        res.json({
          status: 'success',
          message: 'Tweet deleted successfully'
        })
      })
  }
}

module.exports = tweetController
