
const { Tweet, User, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User, Reply]
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id)
    .then(tweet => {
      if (!tweet) throw new Error("The tweet didn't exist!")
      return tweet
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  createTweet: (req, res, next) => {
    const { description } = req.body
    const userId = req.user.id
    if (!description) throw new Error('Descrption text is required!')
    return Tweet.create({
      userId,
      description
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  }
}  

module.exports = tweetController