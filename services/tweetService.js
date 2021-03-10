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
            description: tweet.description.slice(0, 139),
            User: {
              id: tweet.User.id,
              name: tweet.User.name,
              account: tweet.User.account,
              avatar: tweet.User.avatar
            },
            likesNumber: tweet.Likes.length,
            repliesNumber: tweet.Replies.length,
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
            comment: reply.comment.slice(0, 139),
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
          likesNumber: tweet.Likes.length,
          repliesNumber: tweet.Replies.length,
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
        return callback({ status: 'success', message: 'Created Tweet success' })
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
            return callback({ status: 'success', message: 'Tweet was successfully to update' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Put Tweet Fail' }))
  }
}

module.exports = tweetService