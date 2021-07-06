const { Tweet, User, Reply, Like, sequelize } = require('../models')
const QueryTypes = require('sequelize')

const helpers = require('../_helpers')

module.exports = {
  createTweet: async (req, res, next) => {
    try {
      const description = req.body.description.trim()
      // validation
      if (!description) {
        return res.json({ status: 'error', message: '不可新增空白推文' })
      }
      if (description.length > 140) {
        return res.json({ status: 'error', message: '推文字數不可超過 140 字' })
      }
      await Tweet.create({ description, UserId: helpers.getUser(req).id })
      return res.json({
        status: 'success',
        message: '新增推文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await sequelize.query(
        `
        SELECT t.*, IF(i.TweetId, true, false) isLiked, IFNULL(l.likedCount, 0) AS likedCount, IFNULL(r.repliedCount, 0) AS repliedCount
        FROM tweets as t

        LEFT JOIN (SELECT TweetId, count(TweetId) AS likedCount FROM likes GROUP BY TweetId) as l 
        ON l.TweetId = t.id

        LEFT JOIN (SELECT TweetId FROM likes WHERE UserId = ${helpers.getUser(req).id}) as i 
        ON i.TweetId = t.id

        LEFT JOIN (SELECT TweetId, count(TweetId) AS repliedCount FROM replies GROUP BY TweetId) as r 
        ON r.TweetId = t.id

        WHERE t.id = ${Number(req.params.id)}
        `,
        { plain: true, type: QueryTypes.SELECT }
      )
      if (!tweet) {
        return res.json({ status: 'error', message: '找不到推文' })
      }
      // build the user info
      const User = await sequelize.query(
        `
        SELECT *
        FROM users
        WHERE id = ${tweet.UserId}
        `,
        { plain: true, type: QueryTypes.SELECT }
      )
      tweet.User = User

      return res.json(tweet)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweetsInfo = await sequelize.query(
        `
        SELECT IF(i.TweetId, true, false) AS isLiked, IFNULL(l.likedCount, 0) AS likedCount, IFNULL(r.repliedCount, 0) AS repliedCount
        FROM tweets as t

        LEFT JOIN (SELECT TweetId, count(TweetId) AS likedCount FROM likes GROUP BY TweetId) as l
        ON l.TweetId = t.id

        LEFT JOIN (SELECT TweetId FROM likes WHERE UserId = ${helpers.getUser(req).id}) as i 
        ON i.TweetId = t.id

        LEFT JOIN (SELECT TweetId, count(TweetId) AS repliedCount FROM replies GROUP BY TweetId) as r
        ON r.TweetId = t.id

        ORDER BY t.updatedAt DESC, t.id ASC
        `,
        { type: QueryTypes.SELECT }
      )
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        order: [['updatedAt', 'DESC'], ['id', 'ASC']],
        include: [User]
      })
      // combine data
      tweets.forEach((tweet, index) => {
        tweets[index] = { ...tweet, ...tweetsInfo[0][index] }
      })

      return res.json(tweets)
    } catch (err) {
      next(err)
    }
  },
  updateTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({ status: 'error', message: '找不到推文' })
      }
      if (tweet.UserId !== helpers.getUser(req).id) {
        return res.json({ status: 'error', message: '使用者非推文作者，無權限更新' })
      }
      const description = req.body.description
      if (!description) {
        return res.json({ status: 'error', message: '不可新增空白推文' })
      }
      if (description.length > 140) {
        return res.json({ status: 'error', message: '推文字數不可超過 140 字' })
      }

      await tweet.update({ description })
      return res.json({
        status: 'success',
        message: '更新推文成功'
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({ status: 'error', message: '找不到推文' })
      }
      if (tweet.UserId !== helpers.getUser(req).id && helpers.getUser(req).role !== 'admin') {
        return res.json({ status: 'error', message: '使用者非推文作者或管理員，無法刪除' })
      }

      // delete all replies and likes belonging to the tweet
      await Promise.all([
        Reply.destroy({ where: { TweetId: tweet.id } }),
        Like.destroy({ where: { TweetId: tweet.id } }),
        tweet.destroy()
      ])
      return res.json({
        status: 'success',
        message: '刪除推文成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
