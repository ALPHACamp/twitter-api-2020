const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const User = db.User
const helpers = require('../../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    const userId = 5
    // const userId = helpers.getUser(req).id

    return Tweet.findAll({
      include: [
        { model: Reply, as: 'replies' },
        { model: Like, as: 'likes' }
      ],
      where: { UserId: userId }
    }).then(tweets => {
      const tweetsData = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.replies.length,
        likeCount: tweet.likes.length
      }))
      return res.json({ tweets: tweetsData })
    })
  },
  getTweet: (req, res) => {
    const tweetId = req.params.tweet_id
    return Tweet.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'account', 'avatar']},
        { model: Reply, as: 'replies' },
        { model: Like, as: 'likes' }
      ],
      where: { id: tweetId }
    }).then(tweet => {
      const tweetData = tweet.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        user: tweet.user,
        replyCount: tweet.replies.length,
        likeCount: tweet.likes.length
      }))
      return res.json({ tweet: tweetData })
    })
  },
  postTweet: (req, res) => {
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(tweet => {
      res.json({ status: 'success', message: 'Tweet was successfully posted', tweet: tweet })
      return res.redirect(`/tweets/${tweet.id}`)
    })
  },
  getReplies: (req, res) => {
    const tweetId = req.params.tweet_id
    return Tweet.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'account', 'avatar'] },
        { model: Reply, as: 'replies' },
        { model: Like, as: 'likes' }
      ],
      where: { id: tweetId }
    }).then(tweet => {
      const tweetData = tweet.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        user: tweet.user,
        replies: tweet.replies,
        replyCount: tweet.replies.length,
        likeCount: tweet.likes.length
      }))
      return res.json({ tweet: tweetData })
    })
  },
  likeTweet: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id
    }).then(like => {
      return res.json({ status: 'success', message: 'Tweet was liked.' })
    })
  },
  unlikeTweet: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
    }).then(like => {
      like.destroy()
        .then(like => {
          return res.json({ status: 'success', message: 'Tweet was unliked.' })
        })
    })
  },
}

module.exports = tweetController
