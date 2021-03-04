const db = require('../models')
const { Tweet, User, Reply, Like } = db
const helpers = require('../_helpers')

const tweetService = {
  // 取得所有推文資料
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const tweetsData = tweets.map((tweet) => ({
          ...tweet.dataValues,
          User: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          },
          replyCount: tweet.Replies.length,
          likesCount: tweet.Likes.length,
          isLiked: helpers.getUser(req).LikedTweets.map((item) => item.id).includes(tweet.id)
        }))

        callback(tweetsData)
      })
  },

  // 取得一筆推文相關資料
  getTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id, {
      include: [User, Like, { model: Reply, include: [User] }],
      order: [[{ model: Reply }, 'createdAt', 'DESC']]
    })
      .then((tweet) => {
        // 客製化 replies 欄位
        const repliesArray = tweet.Replies.map((reply) => {
          return {
            id: reply.id,
            UserId: reply.UserId,
            TweetId: reply.TweetId,
            comment: reply.comment,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            name: reply.User.name
          }
        })

        const tweetData = {
          ...tweet.dataValues,
          User: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          },
          Replies: repliesArray,
          replyCount: tweet.Replies.length,
          likesCount: tweet.Likes.length,
          isLiked: helpers.getUser(req).LikedTweets.map((item) => item.id).includes(tweet.id)
        }

        callback(tweetData)
      })
  },

  // 新增推文
  postTweet: (req, res, callback) => {
    const { description } = req.body
    if (!description.trim()) {
      return callback({ status: 'error', message: 'Description can not empty' })
    }
    if (description.length > 140) {
      return callback({ status: 'error', message: 'Word is over 140' })
    }

    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: description.trim()
    })
      .then((tweet) => {
        callback({ status: 'success', message: 'Created Tweet success' })
      })
  },

  // 新增回覆
  postReply: (req, res, callback) => {
    const { comment } = req.body
    if (!comment.trim()) {
      return callback({ status: 'error', message: 'Comment can not empty' })
    }
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: comment.trim()
    })
      .then((reply) => {
        callback({ status: 'success', message: 'Created Reply Success' })
      })
  },

  // 標記喜歡
  addLike: (req, res, callback) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then((like) => {
        callback({ status: 'success', message: 'AddLike Success' })
      })
  },

  // 取消標記
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
            callback({ status: 'success', message: 'RemoveLike Success' })
          })
      })
  }
}

module.exports = tweetService