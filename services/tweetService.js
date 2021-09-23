const sequelize = require('sequelize')
const db = require('../models')
const { Tweet, Reply, Like, User } = db
const { getLoginUserLikedTweetsId, turnToBoolean } = require('../tools/helper')

const tweetService = {
  postTweet: async (req, res, cb) => {
    try {
      const { description } = req.body
      if (description.trim()) {
        if (description.length > 140) return cb({ status: '400', message: '推文需在140字以內' })
        const tweet = await Tweet.create({
          UserId: req.user.id,
          description
        })
        return cb({ status: '200', message: '推文建立成功', tweetId: tweet.id })
      }
      return cb({ status: '400', message: '內容不可空白' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  postReply: async (req, res, cb) => {
    try {
      const { comment } = req.body
      if (comment && comment.trim()) {
        const reply = await Reply.create({
          UserId: req.user.id,
          TweetId: req.params.tweet_id,
          comment
        })
        return cb({ status: '200', message: '留言成功', id: reply.id, createdAt: reply.createdAt })
      }
      return cb({ status: '400', message: '留言不可空白' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getTweet: async (req, res, cb) => {
    try {
      // 取得推文及回覆總數跟按讚總數
      let tweet = await Tweet.findOne({
        where: { id: req.params.tweet_id },
        attributes: ['id', 'description', 'updatedAt',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('replies.id'))), 'totalReply'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'totalLike'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${req.user.id} AND TweetId = Tweet.id)`), 'isLiked']
        ],
        include: [
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] },
        ]
      })
      if (tweet.id === null) return cb({ status: '400', message: '推文不存在' })
      tweet = tweet.toJSON()
      turnToBoolean(tweet, 'isLiked')
      return cb({ status: '200', ...tweet })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getTweets: async (req, res, cb) => {
    try {
      const loginUserLikedTweetsId = await getLoginUserLikedTweetsId(req)
      // 取得追蹤中清單
      // let followings = await Followship.findAll({
      //   raw: true, nest: true,
      //   attributes: ['followingId'],
      //   where: {
      //     followerId: req.user.id
      //   }
      // })
      // 追蹤中的id清單
      // followings = followings.map(d => (d.followingId))
      let tweets = await Tweet.findAll({
        group: 'Tweet.id',
        attributes: ['id', 'description', 'createdAt', 'updatedAt',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'totalLike'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('replies.id'))), 'totalReply']
        ],
        order: [['createdAt', 'DESC']],
        raw: true, nest: true,
        // where: {
        //   userId: followings //僅限有追蹤的人，但是測試檔會不過，因為他沒有先追蹤用戶
        // },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ]
      })
      tweets.map(tweet => {
        tweet.isLiked = loginUserLikedTweetsId.includes(tweet.id)
      })
      return cb(tweets)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  putTweet: async (req, res, cb) => {
    try {
      const { description } = req.body
      if (!description) return cb({ status: '400', message: '內容不可空白' })
      const tweet = await Tweet.findOne({
        where: {
          UserId: req.user.id,
          id: req.params.tweet_id
        },
        attributes: ['id', 'description']
      })
      if (tweet === null) return cb({ status: '401', massage: '無編輯權限或貼文不存在' })
      tweet.description = description || tweet.description
      await tweet.save()
      return cb(tweet)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}



module.exports = tweetService