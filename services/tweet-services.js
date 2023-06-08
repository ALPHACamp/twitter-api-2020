const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers.js')

const tweetServices = {

  getTweet: (req, cb) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [User, Reply, Like]
    })
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        const data = {
          ...tweet.toJSON(),
          isLiked: tweet.Likes.map(tweet => tweet.UserId).includes(helpers.getUser(req).id),
          replyCount: tweet.Replies.length,
          likedCount: tweet.Likes.length
        }
        delete data.User.password
        delete data.Replies
        delete data.Likes
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(tweet => tweet.UserId).includes(helpers.getUser(req).id),
            replyCount: tweet.Replies.length,
            likedCount: tweet.Likes.length
          }
          delete tweet.User.password
          delete tweet.Replies
          delete tweet.Likes
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    if (description.length > 140) throw new Error('字數不能超過 140 字')
    if (!description.trim()) throw new Error('留言不能為空白')
    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
