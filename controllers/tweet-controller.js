const { Tweet, User } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    const user = helpers.getUser(req)
    const UserId = user.id

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Tweet.create({
          UserId,
          description
        })
      })
      .then(tweet => {
        res.json({
          tweet
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: { model: User }
    })
      .then(data => {
        const tweets = data.map(tweet => tweet.toJSON())
        console.log('tweets', tweets)
        res.json(tweets)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
