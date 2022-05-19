const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')

const tweets = {
  getAll: async (UserId) => {
    try {
      const rawTweets = await Tweet.findAll({
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: User,
            attributes: [
              'id',
              'name',
              'account',
              'avatar'
            ]
          },
          {
            model: Like,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('Likes.Tweet_id')), 'likeCounts']
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        group: ['id'],
        nest: true,
        raw: true
      })
      if (UserId) {
        const userLikesTweet = await Like.findAll({
          attributes: [
            'TweetId'
          ],
          where: {
            User_id: UserId
          },
          raw: true
        })

        if (!userLikesTweet.length) {
          rawTweets.forEach(element => {
            element.userLikesTweet = 0
            element.isLike = false
          })
        }
        userLikesTweet.forEach(likeTweets => {
          rawTweets.forEach(tweet => {
            if (likeTweets.TweetId === tweet.id) {
              tweet.isLike = true
            } else if (!tweet.isLike) { tweet.isLike = false }
          })
        })
      }
      const replies = await Reply.count({
        group: ['Tweet_id'],
        raw: true
      })
      if (!replies.length) {
        rawTweets.forEach(element => {
          element.replyNum = 0
        })
      } else {
        replies.forEach(replyElement => {
          rawTweets.forEach(element => {
            if (element.id === replyElement.Tweet_id) {
              element.replyCounts = replyElement.count
            } else {
              if (element.replyCounts === undefined) element.replyCounts = 0
            }
          })
        })
      }
      const tweets = rawTweets.map(element => ({
        TweetId: element.id,
        name: element.User.name,
        account: element.User.account,
        avatar: element.User.avatar,
        UserId: element.User.id,
        description: element.description,
        tweetCreatedAt: element.createdAt,
        totalLikeCount: element.Likes.likeCounts,
        totalReplyCount: element.replyCounts,
        isLike: element.isLike
      }))
      return tweets
    } catch (err) {
      console.log(err)
    }
  },
  getOne: async (TweetId, UserId) => {
    try {
      const rawTweet = await Tweet.findByPk(TweetId, {
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: User,
            attributes: [
              'id',
              'name',
              'account',
              'avatar'
            ]
          },
          {
            model: Like,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('Likes.Tweet_id')), 'likeNum']
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        group: ['id'],
        nest: true,
        raw: true
      })
      const replies = await Reply.count({
        where: {
          TweetId
        },
        group: ['Tweet_id'],
        raw: true
      })
      if (!replies.length) {
        rawTweet.replyNum = 0
      } else {
        rawTweet.replyNum = replies[0].count
      }
      if (UserId) {
        const userLikesTweet = await Like.findOne({
          attributes: [
            'TweetId'
          ],
          where: {
            UserId,
            Tweet_id: TweetId
          },
          raw: true
        })
        if (userLikesTweet) rawTweet.isLike = true
        else rawTweet.isLike = false
      }
      const tweet = {
        TweetId: rawTweet.id,
        UserId: rawTweet.User.id,
        name: rawTweet.User.name,
        account: rawTweet.User.account,
        avatar: rawTweet.User.avatar,
        description: rawTweet.description,
        tweetCreatedAt: rawTweet.createdAt,
        totalLikeCount: rawTweet.Likes.likeNum,
        totalReplyCount: rawTweet.replyNum,
        isLike: rawTweet.isLike
      }
      return tweet
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweets
