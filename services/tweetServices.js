const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetServices = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      include: [
        User, Like,
        { model: Reply, include: [User] },
      ]
    }).then(tweets => {
      tweets = tweets.map(r => ({
        ...r.dataValues,
        likeTweetCount: r.Likes.length,
        replyTweetCount: r.Replies.length,
        isLiked: r.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
      }))
      return callback(tweets)
    })
  },
  getTweet: (req, res, callback) => {
    return Promise.all([
      Tweet.findByPk(req.params.tweet_id, { include: [User] }),
      Reply.findAndCountAll({ include: [User], where: { TweetId: req.params.tweet_id } }),
      Like.findAndCountAll({ where: { TweetId: req.params.tweet_id } })
    ])
      .then(([tweet, replies, likes]) => {
        return callback({
          tweet,
          description: tweet.description,
          replies,
          likes
        })
      })
    // Tweet.findByPk(req.params.tweet_id, {
    //   include: [
    //     User
    //   ]
    // }).then(tweet => {
    //   Reply.findAndCountAll({ include: [User], where: { TweetId: req.params.tweet_id } })
    //     .then(replies => {
    //       Like.findAndCountAll({ where: { TweetId: req.params.tweet_id } })
    //         .then(likes => {
    //           return callback({ 
    //             description: tweet.description,
    //             replies,
    //             likes
    //           })
    //         })
    //     })
    // })
  },
  postTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    if (!req.body.description) {
      return callback({ status: 'error', message: 'Tweet is empty' })
    }
    if (req.body.description.length <= 140) {
      Tweet.create({
        UserId: USERID,
        description: req.body.description,
      }).then(tweet => {
        return callback({ status: 'success', message: 'Tweet was successfully created' })
      })
    } else {
      return callback({ status: 'error', message: 'Tweet was overed 140' })
    }

  },
  putTweet: (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: 'Tweet is empty' })
    }
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.update({
          description: req.body.description
        })
          .then(tweet => {
            return callback({ status: 'success', message: 'Tweet was successfully to update' })
          })
      })
  },
  deleteSelfTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Tweet.findByPk(req.params.tweet_id, { where: { UserId: USERID } })
      .then(tweet => {
        if (tweet.UserId === USERID) {
          tweet.destroy()
            .then(() => {
              return callback({ status: 'success', message: 'Tweet was successfully to delete' })
            })
        } else {
          return callback({ status: 'error', message: 'User error' })
        }

      })
  }
}

module.exports = tweetServices