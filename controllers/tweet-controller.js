const { Tweet, User, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc') // 引入世界時間插件
const timezone = require('dayjs/plugin/timezone') // // 引入時區插件
const relativeTime = require('dayjs/plugin/relativeTime') // 引入相對時間差
const zhTw = require('dayjs/locale/zh-tw') // 引入繁中

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale(zhTw) // 設置本地為繁中

const tweetController = {
  // 瀏覽所有推文
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const [tweets, likes] = await Promise.all([
        Tweet.findAll({
          order: [['createdAt', 'desc']],
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
          }],
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)' // 在資料庫篩選此篇推文所有like數量
                ),
                'likesNum'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)' // 在資料庫篩選此篇推文所有回覆數量
                ),
                'repliesNum'
              ]
            ]
          },
          nest: true,
          raw: true
        }),
        Like.findAll({ where: { UserId: userId } })
      ])
      const result = tweets.map(tweet => ({
        ...tweet,
        updatedAt: dayjs(tweet.updatedAt)
          .tz('Asia/Taipei')
          .fromNow(),
        isLiked: likes.some(like => like.TweetId === tweet.id) // 若Like model中，登入者id = 推文id，代表登入者有點讚，回傳ture，反之false
      }))
      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  },
  // 瀏覽特定推文
  getTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const [tweet, likes] = await Promise.all([
        Tweet.findByPk(req.params.id, {
          order: [['createdAt', 'desc']],
          include: [{
            model: User,
            attributes: ['account', 'name', 'avatar']
          }],
          attributes: {
            include: [
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'
                ),
                'likesNum'
              ],
              [
                sequelize.literal(
                  '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'
                ),
                'repliesNum'
              ]
            ]
          }
        }),
        Like.findAll({ where: { UserId: userId } })
      ])
      const tweetData = tweet.toJSON()
      tweetData.isLiked = likes.some(like => like.TweetId === tweet.id)
      tweetData.createdAt = dayjs(tweetData.createdAt)
        .tz('Asia/Taipei')
        .format('A h:mm ‧ YYYY年M月D日')
        .replace('AM', '上午')
        .replace('PM', '下午')

      return res.status(200).json(tweetData)
    } catch (err) {
      return next(err)
    }
  },
  // 發佈一則推文
  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { description } = req.body
      if (!description) {
        throw new Error('內容不可空白')
      } else if (description.length > 140) {
        throw new Error('內容不能超過140字')
      }
      const newTweet = await Tweet.create({
        description,
        UserId: userId
      })
      const tweetData = newTweet.toJSON()
      return res.status(200).json(tweetData)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
