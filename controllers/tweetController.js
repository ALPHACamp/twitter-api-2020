'use strict'

const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id

      const tweets = await Tweet.findAll({
        attributes: ['id', 'description', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })

      // 無推文資料
      if (!tweets) {
        return res
          .status(200)
          .json({ status: 'success', message: '無推文資料' })
      }

      // get tweet ID
      const tweetIds = tweets.map(tweet => tweet.id)
      // get likes for tweets liked by the current user
      const likes = await Like.findAll({
        where: {
          TweetId: {
            [Op.in]: tweetIds
          },
          UserId: currentUserId
        },
        raw: true
      })

      // get tweetId(array) liked by the current user
      const currentUserLikes = likes.map(l => l.TweetId)

      const data = tweets.map(tweet => {
        return {
          TweetId: tweet.id,
          description: tweet.description,
          tweetOwnerId: tweet.User.id,
          tweetOwnerName: tweet.User.name,
          tweetOwnerAccount: tweet.User.account,
          tweetOwnerAvatar: tweet.User.avatar,
          createdAt: tweet.createdAt,
          replyCount: tweet.dataValues.Replies.length,
          likeCount: tweet.dataValues.Likes.length,
          isLiked: currentUserLikes.includes(tweet.dataValues.id)
        }
      })

      return res.status(200).json(data)
    } catch (err) {
      return next(err)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const { description } = req.body
      const UserId = user.id

      // check if description is whitespace
      if (!description.trim().length) {
        return res.status(404).json({
          status: 'error',
          message: '內容不可為空白'
        })
      }

      // check if description is more than 140 characters
      if (description.trim().length > 140) {
        return res.status(404).json({
          status: 'error',
          message: '字數超過限制, 請輸入少於140個字'
        })
      }

      // create a new tweet
      const newTweet = await Tweet.create({
        UserId,
        description
      })

      const replyCount = await Reply.count({ where: { TweetId: newTweet.id } })
      const likeCount = await Like.count({ where: { TweetId: newTweet.id } })

      const data = {
        TweetId: newTweet.id,
        description: newTweet.description,
        tweetOwnerId: user.id,
        tweetOwnerName: user.name,
        tweetOwnerAccount: user.account,
        tweetOwnerAvatar: user.avatar,
        createdAt: newTweet.createdAt,
        replyCount,
        likeCount,
        isLiked: false
      }
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, ({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id )'), 'likeCount']
          ]
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply
          },
          {
            model: Like,
            attributes: ['UserId']
          }
        ],
        order: [[Tweet.associations.Replies, 'createdAt', 'DESC']],
        nest: true
      })
      )
      if (!tweet) return res.status(404).json({ status: 'error', message: '推文不存在' })

      const { id, description, createdAt, replyCount, likeCount, Replies } = tweet
      const currentUserLikes = tweet.Likes.map(l => l.TweetId)
      const data = {
        TweetId: id,
        description,
        tweetOwnerId: tweet.User.id,
        tweetOwnerName: tweet.User.name,
        tweetOwnerAccount: tweet.User.account,
        tweetOwnerAvatar: tweet.User.avatar,
        createdAt,
        replyCount,
        likeCount,
        isLiked: currentUserLikes.includes(tweet.id),
        Replies
      }
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId, {
        attributes: ['id', 'description', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account']
          }
        ],
        raw: true,
        nest: true
      })

      if (!tweet) {
        return res.status(404).json({ status: 'error', message: '推文不存在' })
      }

      const replies = await Reply.findAll({
        attributes: [
          'id',
          'comment',
          'createdAt',
          [sequelize.col('User.id'), 'userId'],
          [sequelize.col('User.name'), 'name'],
          [sequelize.col('User.account'), 'account'],
          [sequelize.col('User.avatar'), 'avatar']
        ],
        include: [
          {
            model: User,
            attributes: []
          }
        ],
        where: { TweetId: tweetId },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      if (!replies) {
        return res
          .status(200)
          .json({ status: 'success', message: '無回覆內容' })
      }

      const data = replies.map(reply => ({
        replyId: reply.id,
        comment: reply.comment,
        replyOwnerId: reply.userId,
        replyOwnerName: reply.name,
        replyOwnerAccount: reply.account,
        replyOwnerAvatar: reply.avatar,
        createdAt: reply.createdAt,
        tweetOwnerId: tweet.User.id,
        tweetOwnerName: tweet.User.name,
        tweetOwnerAccount: tweet.User.account
      }))

      return res.status(200).json(data)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
