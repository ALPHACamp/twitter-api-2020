const sequelize = require('sequelize')
// const { getUser } = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Promise.all([
      Tweet.findAll({
        attributes: [ // 指定回傳model欄位
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
          ]
        ],
        order: [['createdAt', 'DESC']], // 用建立時間先後排序
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      }),
      Like.findAll({})
    ])
      .then(([tweets, likes]) => {
        const data = tweets.map(tweet => ({
          ...tweet
        }))
        res.status(200).json({ success: true, data }) // 照前端需求統一以success的布林值判斷res是否成功
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Tweet.findByPk(id, {
        attributes: ['id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
          ]
        ],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        nest: true
      }),
      Like.findAll({ where: { id }, raw: true })
    ])
      .then(([tweet, likes]) => {
        if (!tweet) {
          return res.status(404).json({
            success: false, // 照前端需求統一以success的布林值判斷res是否成功
            message: 'Tweet not found'
          })
        }
        res.status(200).json({ success: true, tweet })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
