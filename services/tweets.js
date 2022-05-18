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
            UserId
          },
          raw: true
        })

        if (!userLikesTweet.length) {
          rawTweets.forEach(element => {
            element.userLikesTweet = 0
          })
        }
        userLikesTweet.forEach(likeTweets => {
          rawTweets.forEach(tweet => {
            likeTweets.TweetId === tweet.id
              ? tweet.isLike = true
              : tweet.isLike = false
          })
        })
      }
      const replies = await Reply.count({
        group: ['Tweet_id'],
        raw: true
      })

      for (let replyIndex = 0; replyIndex < replies.length; replyIndex++) {
        for (let tweetIndex = 0; tweetIndex < rawTweets.length; tweetIndex++) {
          if (rawTweets[tweetIndex].id === replies[replyIndex].Tweet_id) {
            rawTweets[tweetIndex].replyCounts = replies[replyIndex].count
          } else {
            if (rawTweets[tweetIndex].replyCounts === undefined) rawTweets[tweetIndex].replyCounts = 0
          }
        }
      }
      const tweets = rawTweets.map(element => ({
        id: element.id,
        name: element.User.name,
        account: element.User.account,
        avatar: element.User.avatar,
        userId: element.User.id,
        description: element.description,
        createdAt: element.createdAt,
        likeNum: element.Likes.likeCounts,
        replyNum: element.replyCounts,
        isLike: element.isLike
      }))
      return tweets
    } catch (err) {
      console.log(err)
    }
  },
  getOne: async (tweetId, UserId) => {
    try {
      const rawTweet = await Tweet.findByPk(tweetId, {
        attributes: {
          exclude: ['updatedAt']
        },
        include: [
          {
            model: User,
            attributes: [
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
      const replies = await Reply.count({
        group: ['Tweet_id'],
        raw: true
      })

      if (replies !== undefined) {
        rawTweet.replyCounts = 0
      } else {
        rawTweet.replyCounts = replies[0].count
      }

      if (UserId) {
        const userLikesTweet = await Like.findOne({
          attributes: [
            'TweetId'
          ],
          where: {
            UserId
          },
          raw: true
        })
        userLikesTweet.TweetId === rawTweet.id
          ? rawTweet.isLike = true
          : rawTweet.isLike = false
      }
      const tweet = {
        id: rawTweet.id,
        name: rawTweet.User.name,
        account: rawTweet.User.account,
        avatar: rawTweet.User.avatar,
        description: rawTweet.description,
        createdAt: rawTweet.createdAt,
        likeNum: rawTweet.Likes.likeCounts,
        replyNum: rawTweet.replyCounts,
        isLike: rawTweet.isLike
      }
      return tweet
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweets
