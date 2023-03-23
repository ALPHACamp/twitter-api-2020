const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    const offset = Number(req.query.offset) || 0
    Tweet.findAll({ offset: offset, limit: 10, include: [User, Like, Reply], order: [['createdAt', 'DESC']] })
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
            banner: tweet.User.banner
          }
        }))
        if (tweets.length !== 0) {
          return res.json(tweets)
        } else {
          return res.json('loadToEnd')
        }
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
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
            name: tweet.User.name
          }
        }
        tweet.likesLength = tweet.Likes.length
        tweet.repliesLength = tweet.Replies.length
        return res.json(tweet)
      })
      .catch(error => {
        return res.status(404).json({ status: 'error', message: 'not-found', error: error })
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
        User.findByPk(userId)
          .then(user => {
            user.update({
              tweetsNum: user.tweetsNum + 1
            })
              .then(() => {
                return res.json({ status: 'success', message: '', tweetId: tweet.id })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
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
        User.findByPk(userId)
          .then(user => {
            user.update({
              likesNum: user.likesNum + 1
            })
              .then(() => {
                return res.json({ status: 'success', message: '' })
              })
          })
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
            User.findByPk(userId)
              .then(user => {
                user.update({
                  likesNum: user.likesNum - 1
                })
                  .then(() => {
                    return res.json({ status: 'success', message: '' })
                  })
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  },
  getTweetReplies: (req, res) => {
    const tweetId = req.params.id
    Reply.findAll({ where: { TweetId: tweetId }, include: [User, { model: Tweet, include: [User] }], order: [['createdAt', 'DESC']] })
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
            name: reply.User.name
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
              name: reply.Tweet.User.name
            }
          }
        }))
        return res.json(replies)
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
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
        User.findByPk(userId)
          .then(user => {
            user.update({
              repliesNum: user.repliesNum + 1
            })
              .then(() => {
                return res.json(reply)
              })
          })
      })
      .catch(error => {
        return res.status(401).json({ status: 'error', error: error })
      })
  }
}

module.exports = tweetController
