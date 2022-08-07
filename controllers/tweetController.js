const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({ limit: 20, include: [User, Like, Reply] })
      .then(tweets => {
        tweets = { tweets: tweets }
        tweets = JSON.stringify(tweets)
        tweets = JSON.parse(tweets)
        tweets = tweets.tweets.map(tweet => ({
          ...tweet,
          likesLength: tweet.Likes.length,
          repliesLength: tweet.Replies.length,
          User: {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            introduction: tweet.User.introduction,
            name: tweet.User.name,
            role: tweet.User.role,
            banner: tweet.User.banner,
          }
        }))
        return res.json(tweets)
      })
  },
  getTweet: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, { include: [User, Like, Reply] })
      .then(tweet => {
        tweet = { tweet: tweet }
        tweet = JSON.stringify(tweet)
        tweet = JSON.parse(tweet)
        tweet = tweet.tweet
        if (tweet.User) {
          tweet.User = {
            account: tweet.User.account,
            avatar: tweet.User.avatar,
            id: tweet.User.id,
            name: tweet.User.name,
          }
        }
        tweet.likesLength = tweet.Likes.length
        tweet.repliesLength = tweet.Replies.length
        return res.json(tweet)
      })
  },
  postTweet: (req, res) => {
    const userId = req.user.id
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
    const userId = req.user.id
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
    const userId = req.user.id
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
    const tweetId = req.params.id
    Reply.findAll({ where: { TweetId: tweetId }, include: [User, { model: Tweet, include: [User] }] })
      .then(replies => {
        replies = replies.map(reply => ({
          id: reply.id,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          comment: reply.comment,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          User: {
            account: reply.User.account,
            avatar: reply.User.avatar,
            id: reply.User.id,
            name: reply.User.name,
          },
          Tweet: {
            id: reply.Tweet.id,
            UserId: reply.Tweet.UserId,
            description: reply.Tweet.description,
            createdAt: reply.Tweet.createdAt,
            updatedAt: reply.Tweet.updatedAt,
            User: {
              account: reply.Tweet.User.account,
              avatar: reply.Tweet.User.avatar,
              id: reply.Tweet.User.id,
              name: reply.Tweet.User.name,
            }
          }
        }))
        return res.json(replies)
      })
  },
  postTweetReply: (req, res) => {
    const userId = req.user.id
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
