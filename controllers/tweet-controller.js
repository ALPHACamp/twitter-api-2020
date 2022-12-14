const { Tweet, User, Reply } = require('../models')
const helpers = require('../_helpers')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const isYesterday = require('dayjs/plugin/isYesterday')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
dayjs.extend(isYesterday)

const tweetController = {
  // 新增推文：
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('Description is required!')
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description
    })
      .then(newTweet => {
        res.json(newTweet)
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
            // [ 修 ]：發文過一週？是的話顯示日期，不是的話顯示多久之前
            relativeTime: dayjs(tweet.dataValues.createdAt).fromNow()
            // 計算 reply 該推文的回覆數
            // repliedCount: tweet.replies.length
            // 計算 like 該推文的人數
            // likedCount: tweet.likes.length
          }))
      })
      .then(tweets => {
        res.json(tweets)
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
        const treetJSON = tweet.toJSON()
        const treetNew = {
          ...treetJSON,
          exactTime: dayjs(tweet.dataValues.createdAt).format('A hh:mm YYYY年 MMM DD日')
        }
        return res.json(
          treetNew
          // 計算 reply 該推文的回覆數
          // repliedCount: tweet.replies.length
          // 計算 like 該推文的人數
          // likedCount: tweet.likes.length
        )
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
