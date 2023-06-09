const { Tweet, User, Like, Reply } = require('../models')
const sequelize = require('sequelize')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')

const tweetServices = {
  getTweets: async(req, cb) => {
    try{
      const tweets = await Tweet.findAll({
        include: User,
        nest: true,
        raw: true,
        order:[['createdAt', 'DESC']],
        include: [
          {
            model:User
          },
          {
            model:Reply,
            as: 'replied',
            attribute: []
          },
          {
            model:Like,
            as: 'liked',
            attribute: []
          },
        ],
        attributes:{
          include: [
            [sequelize.fn('COUNT', sequelize.col('replied.id')), 'repltCount'],
            [sequelize.fn('COUNT', sequelize.col('liked.id')), 'likedCount']
          ]
        },
        group: ['Tweet.id', 'User.id','replied.id', 'liked.id']
      })
        const newData = tweets.map(tweet => {
              tweet.createdAt = relativeTimeFromNow(tweet.createdAt)
              delete tweet.User.password
              return tweet
              })
              cb(null, newData)
    } catch (err) {
          cb(err)
      }
    },
  getTweet: async(req, cb) => {
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