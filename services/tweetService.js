const db = require('../models')
const { Tweet, User, Reply, Like } = db
const helpers = require('../_helpers')

const tweetService = {
  // 取得所有推文資料
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      nest: true,
      include: [User, Reply, Like],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const tweetsData = tweets.map((tweet) => {

          return {
            ...tweet.dataValues,
            User: {
              id: tweet.User.id,
              name: tweet.User.name,
              account: tweet.User.account,
              avatar: tweet.User.avatar
            },
            replyCount: tweet.Replies.length,
            likesCount: tweet.Likes.length,
            isLiked: tweet.Likes.map((item) => item.UserId).includes(helpers.getUser(req).id)
          }
        })

        return callback(tweetsData)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Tweets Fail' }))
  },

  // 取得一筆推文相關資料
  getTweet: (req, res, callback) => {
    const id = req.params.tweet_id

    return Tweet.findByPk(id, {
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
            name: reply.User.name,
            User: reply.User
          }
        })

        // console.log('***:', helpers.getUser(req).LikedTweets[0].id)

        const tweetData = {
          ...tweet.dataValues,
          User: {
            id: tweet.User.id,
            name: tweet.User.name,
            account: tweet.User.account,
            avatar: tweet.User.avatar
          },
          Replies: repliesArray,
          replyCount: tweet.Replies.length,
          likesCount: tweet.Likes.length,
          isLiked: tweet.Likes.map((item) => item.UserId).includes(helpers.getUser(req).id)
          // isLiked: helpers.getUser(req).LikedTweets.map((item) => item.id).includes(tweet.id)
        }

        return callback(tweetData)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Tweet Fail' }))
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
      .catch((error) => callback({ status: 'error', message: 'Post Tweet Fail' }))
  },

  // 更新推文內容
  putTweet: (req, res, callback) => {
    const { description } = req.body
    const id = req.params.tweet_id

    if (!description.trim()) {
      return callback({ status: 'error', message: 'Description can not empty' })
    }
    if (description.length > 140) {
      return callback({ status: 'error', message: 'Word is over 140' })
    }

    return Tweet.findByPk(id)
      .then((tweet) => {
        tweet.update({
          description: description.trim()
        })
          .then((tweet) => {
            callback({ status: 'success', message: 'Tweet was successfully to update' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Put Tweet Fail' }))
  },

  // 查詢推文的相關回覆資料
  getReplies: (req, res, callback) => {
    const id = req.params.tweet_id

    return Reply.findAll({
      where: { TweetId: id },
      include: [{ model: User, attributes: ['name', 'account'] }]
    })
      .then((replies) => {
        callback(replies)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Replies Fail' }))
  },

  // 查詢推文的相關回覆量
  getRepliesCount: (req, res, callback) => {
    const id = req.params.tweet_id

    return Reply.findAll({
      where: { TweetId: id },
      include: [{ model: User, attributes: ['name', 'account'] }]
    })
      .then((replies) => {
        callback(replies.length)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Replies Fail' }))
  },

  // 新增回覆
  postReply: (req, res, callback) => {
    const { comment } = req.body

    if (!comment.trim()) {
      return callback({ status: 'error', message: 'Comment can not empty' })
    }

    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: comment.trim()
    })
      .then((reply) => {
        callback({ status: 'success', message: 'Created Reply Success' })
      })
      .catch((error) => callback({ status: 'error', message: 'Post Reply Fail' }))
  },

  // 更新回覆內容
  putReply: (req, res, callback) => {
    const { comment } = req.body
    const id = req.params.reply_id

    if (!comment.trim()) {
      return callback({ status: 'error', message: 'Comment can not empty' })
    }

    return Reply.findByPk(id)
      .then((reply) => {
        reply.update({
          comment: comment.trim()
        })
          .then((reply) => {
            callback({ status: 'success', message: 'Reply was successfully to update' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Put Reply Fail' }))
  },

  // 刪除回覆
  deleteReply: (req, res, callback) => {
    const id = req.params.reply_id

    return Reply.findByPk(id)
      .then((reply) => {
        if (!reply) {
          callback({ status: 'error', message: 'Reply was not exist' })
        }

        reply.destroy()
          .then((result) => {
            callback({ status: 'success', message: 'Delete Reply Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Delete Tweet Fail' }))
  },

  // 取得推文按讚數、相關資訊
  getLikes: (req, res, callback) => {
    const id = req.params.tweet_id

    Tweet.findByPk(id, { include: [Like] })
      .then((tweet) => {
        const tweetData = {
          ...tweet.dataValues,
          likesCount: tweet.Likes.length
        }
        callback(tweetData)
      })
      .catch((error) => callback({ status: 'error', message: 'Get Tweet Fail' }))
  },

  // 標記喜歡
  addLike: (req, res, callback) => {
    const id = req.params.tweet_id

    return Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: id
    })
      .then((like) => {
        callback({ status: 'success', message: 'AddLike Success' })
      })
      .catch((error) => callback({ status: 'error', message: 'AddLike To Tweet Fail' }))
  },

  // 取消標記
  removeLike: (req, res, callback) => {
    const id = req.params.tweet_id

    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: id
      }
    })
      .then((like) => {
        like.destroy()
          .then((result) => {
            callback({ status: 'success', message: 'RemoveLike Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'RemoveLike To Tweet Fail' }))
  }
}

module.exports = tweetService