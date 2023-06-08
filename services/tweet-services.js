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
  },
  getTweetReplies: (req, cb) => {
    console.log(req.params.tweet_id)
    Promise.all([
      Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: User
      }),
      Tweet.findByPk(req.params.tweet_id, { include: User })
    ])
      .then(([replies, tweet]) => {
        if (!tweet) throw new Error('tweet not found')
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            repliesAccount: tweet.User.account
          }
          delete reply.User.password
          return reply
        })
        return cb(null, replies)
      })
      .catch(err => cb(err))
  },
  postTweetReplies: (req, cb) => {
    const { comment } = req.body
    if (comment.length > 140) throw new Error('字數不能超過 140 字')
    if (!comment.trim()) throw new Error('留言不能為空白')
    Tweet.findByPk(req.params.tweet_id)
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        return Reply.create({
          comment,
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        })
      })
      .then(newReply => cb(null, newReply))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
