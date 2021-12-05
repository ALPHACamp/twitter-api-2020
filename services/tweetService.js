const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const tweetService = {
  postTweet: (req, res, callback) => {
    if (!req.body.description) {
      callback({ status: 'error', message: 'text didn\'t exist' })
    } else {
      return Tweet.create({
        description: req.body.description,
        UserId: helpers.getUser(req).id
      })
        .then((category) => {
          callback({
            status: 'success',
            message: 'tweet was successfully created',
          })
        })
    }
  },
  getTweets: (req, res, callback) => {
    return Tweet.findAll({ include: User }).then(result => {
      callback(
        { tweets: result }
      )
    })
  },
  getTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] }
      ]
    }).then(tweet => {
      console.log(tweet)
      // console.log(tweet.User)
      const isLiked = tweet.User.map(d => d.id).includes(helpers.getUser(req).id)
      callback({
        tweet: tweet,
        isLiked: isLiked
      })
    })
  },
}

module.exports = tweetService