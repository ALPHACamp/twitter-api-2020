const db = require('../models')
const { Tweet, User, Reply, Like } = db
const helpers = require('../_helpers')

const tweetService = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const tweetsData = tweets.map((tweet) => ({
          ...tweet.dataValues,
          User: {
            id: tweet.User.id,
            account: tweet.user.account,
            name: tweet.user.name,
            avatar: tweet.user.avatar
          },
          replyCount: tweet.Relies.length,
          likesCount: tweet.Likes.length,
          isLiked: helpers.getUser(req).LikedTweets.map((item) => item.id).includes(tweet.id)
        }))

        callback(tweetsData)
      })
  },

  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.id, {
      include: [User, Like, Reply],
      order: [[{ model: Reply }, 'createdAt', 'DESC']]
    })
      .then((tweet) => {
        const tweetData = {
          ...tweet.dataValues,
          User: {
            id: tweet.User.id,
            account: tweet.user.account,
            name: tweet.user.name,
            avatar: tweet.user.avatar
          },
          Replies: tweet.Relies,
          replyCount: tweet.Relies.length,
          likesCount: tweet.Likes.length,
          isLiked: helpers.getUser(req).LikedTweets.map((item) => item.id).includes(tweet.id)
        }

        callback(tweetData)
      })
  },

  postTweet: (req, res, callback) => {
    const { description } = req.body
    if (!description.trim()) {
      callback({ status: 'error', message: 'Description can not empty' })
    }
    if (description.length > 140) {
      callback({ status: 'error', message: 'Word is over 140' })
    }

    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: description.trim()
    })
      .then((tweet) => {
        callback({ status: 'success', message: 'Created Tweet success' })
      })
  },

  postReply: (req, res, callback) => {
    const { comment } = req.body
    if (!comment.trim()) {
      callback({ status: 'error', message: 'Comment can not empty' })
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: comment.trim()
    })
      .then((reply) => {
        callback({ status: 'success', message: 'Created Reply success' })
      })
  },

  addLike: (req, res, callback) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then((like) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        like.destroy()
          .then((result) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = tweetService