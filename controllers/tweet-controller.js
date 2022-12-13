const { Tweet, User, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
const isYesterday = require('dayjs/plugin/isYesterday')
dayjs.extend(isYesterday)

const tweetController = {
  // 新增推文：
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('Description is required!')
    Tweet.create({
      UserId: getUser(req).id,
      description
    })
      .then(newTweet => {
        res.json({
          status: 'success',
          tweet: newTweet
        })
      })
      .catch(err => next(err))
  },
  // 取得所有推文：
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        User,
        { model: Reply, include: User }
      ]
    })
      .then(tweets => {
        return tweets
          .map(tweet => ({
            ...tweet.dataValues,
            // [ 修？ ]：未滿24小時，到隔天會顯示日期
            relativeTime: dayjs(tweet.dataValues.createdAt).add(-1, 'day').isYesterday() ? dayjs(tweet.dataValues.createdAt).fromNow() : dayjs(tweet.dataValues.createdAt).format('MMM DD日')
            // 計算 reply 該推文的回覆數
            // repliedCount: tweet.replies.length
            // 計算 like 該推文的人數
            // likedCount: tweet.likes.length
          }))
      })
      .then(tweets => {
        res.json({
          status: 'success',
          tweets
        })
      })
      .catch(err => next(err))
  },
  // 取得一則推文：
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        { model: Reply, include: User }
      ]
    })
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return res.json({
          status: 'success',
          tweet: tweet.toJSON(),
          exactTime: dayjs(tweet.dataValues.createdAt).format('A hh:mm YYYY MMM DD日')
          // 計算 reply 該推文的回覆數
          // repliedCount: tweet.replies.length
          // 計算 like 該推文的人數
          // likedCount: tweet.likes.length
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
