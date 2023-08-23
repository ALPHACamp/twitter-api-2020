const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweet: (req, res, next) => {
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.id) : []
    Tweet.findByPk(req.params.tweet_id, {
      include: [User, Like, Reply],
      nest: true
    })
      .then(tweet => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        tweet = tweet.toJSON()
        tweet.likesCount = tweet.Likes.length
        tweet.repliesCount = tweet.Replies.length
        tweet.isLiked = likedTweetsId.includes(tweet.id)
        delete tweet.Likes
        delete tweet.Replies
        delete tweet.User.password
        return res.json(tweet)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.id) : []
    Tweet.findAll({
      include: [
        { model: User, attributes: { exclude: 'password' } },
        Like,
        Reply
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(tweet => {
          tweet = tweet.toJSON()
          tweet.likesCount = tweet.Likes.length
          tweet.repliesCount = tweet.Replies.length
          tweet.isLiked = likedTweetsId.includes(tweet.id)
          delete tweet.Likes
          delete tweet.Replies
          return tweet
        })
        return res.json(data)
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
