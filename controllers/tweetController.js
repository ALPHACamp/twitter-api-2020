'use strict'

const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')
const { Op } = require('sequelize')

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
  }
}

module.exports = tweetController
