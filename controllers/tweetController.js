const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    const userId = 1
    Tweet.findAll({ where: { UserId: userId }, include: [User, Like, Reply] })
      .then(tweets => {
        tweets = { tweets: tweets }
        tweets = JSON.stringify(tweets)
        tweets = JSON.parse(tweets)
        tweets = tweets.tweets.map(tweet => ({
          ...tweet,
          User: {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            introduction: tweet.User.introduction,
            name: tweet.User.name,
            role: tweet.User.role,
          }
        }))
        return res.json(tweets)
      })
  },
  getTweet: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, { include: [User, Like, { model: Reply, include: User }] })
      .then(tweet => {
        tweet = { tweet: tweet }
        tweet = JSON.stringify(tweet)
        tweet = JSON.parse(tweet)
        tweet = tweet.tweet
        if (tweet.User) {
          tweet.User = {
            ...tweet.User,
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            introduction: tweet.User.introduction,
            name: tweet.User.name,
            role: tweet.User.role
          }
        }
        if (tweet.Replies[0].User.account) {
          tweet.Replies = tweet.Replies.map(reply => ({
            TweetId: reply.TweetId,
            User: {
              account: reply.User.account,
              avatar: reply.User.avatar,
              id: reply.User.id,
              introduction: reply.User.introduction,
              name: reply.User.name,
              role: reply.User.role,
            },
            UserId: reply.UserId,
            comment: reply.comment,
            createdAt: reply.createdAt,
            id: reply.id,
            updatedAt: reply.updatedAt,
          }))
        }
        return res.json(tweet)
      })
  },
  postTweet: (req, res) => {
    const userId = req.body.UserId || 1
    const description = req.body.description
    Tweet.create({
      UserId: userId,
      description: description
    })
      .then(tweet => {
        return res.json({ status: 'success', message: '' })
      })
  },
  likeTweet: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Like.create({
      UserId: userId,
      TweetId: tweetId
    })
      .then(like => {
        return res.json({ status: 'success', message: '' })
      })
  },
  unlikeTweet: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Like.findOne({
      where: {
        UserId: userId,
        TweetId: tweetId
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.json({ status: 'success', message: '' })
          })
      })
  },
  getTweetReplies: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Reply.findAll({ where: { UserId: userId, TweetId: tweetId } })
      .then(replies => {
        return res.json(replies)
      })
  },
  postTweetReply: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    const comment = req.body.comment
    Reply.create({
      UserId: userId,
      TweetId: tweetId,
      comment: comment
    })
      .then(reply => {
        return res.json(reply)
      })
  }
}

module.exports = tweetController
