// 照前端需求皆以success的布林值判斷res是否成功

const sequelize = require('sequelize')
// const { getUser } = require('../_helpers')
const { Tweet, User, Like } = require('../models')

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
            success: false,
            message: 'Tweet not found'
          })
        }
        res.status(200).json({ success: true, tweet })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    // const UserId = getUser(req)?.id
    const UserId = 1 // 測試用，待user功能補齊可拿掉
    const { description } = req.body
    // 錯誤判斷
    // 空白內容
    if (!description) {
      return res.status(404).json({
        success: false,
        message: 'description is required!'
      })
    }
    // 超過140字
    if (description.length < 1 || description.length > 140) {
      return res.status(404).json({
        success: false,
        message: 'Tweet is limited to 140 characters'
      })
    }

    User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          })
        }
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(tweet => res.json({ success: true, message: 'Tweet has been added', tweet }))
      .catch(err => next(err))
  }
}

module.exports = tweetController
