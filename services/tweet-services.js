const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { getUserData } = require('../helpers/getUserData')

const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'avatar', 'account']
          }, {
            model: Like
          }, {
            model: Reply
          }],
        order: [['createdAt', 'DESC']]
      })

      if (!tweets) throw new Error("目前沒有任何推文！")
      const userLikedTweetsId = getUserData(req.user.LikedTweets)
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        isLiked: userLikedTweetsId.length ? userLikedTweetsId.includes(tweet.id) : false,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }))

      cb(null, tweets)
    } catch (error) {
      cb(error)
    }
  },
  getTweet: async (req, cb) => {
    const { id } = req.params
    return Promise.all([
      Tweet.findByPk(id, {
        include: [
          User,
        ],
        nest: true,
        raw: true
      }),
      Like.count({
        where: {
          TweetId: id
        }
      }),
      Reply.count({
        where: {
          TweetId: id
        }
      })
    ])
      .then(([tweet, likes, replies]) => {
        if (!tweet) throw new Error("Tweet不存在!")
        cb(null, {
          ...tweet,
          likeCount: likes,
          replyCount: replies,
          createdAt: relativeTimeFromNow(tweet.createdAt)
        })
      })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices