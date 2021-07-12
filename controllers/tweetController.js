const { Tweet, User } = require('../models')
const moment = require('moment')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const result = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'replyCounts', 'likeCounts', 'createdAt'],
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }]
      })
      // 將取得資料做整理
      const tweets = result.map(tweet => ({
        ...tweet,
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
      }))
      return res.json(tweets)
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  },
  postTweet: async (req, res, next) => {
    // 推文內容不得空白，限 140 個字
    const { description } = req.body
    if (!description) return res.json({ status: 'error', message: '推文內容不能為空白！' })
    if (description.length > 140) return res.json({ status: 'error', message: '推文內容上限為140字！' })

    try {
      await Tweet.create({
        description,
        UserId: req.user.id
      })
      return res.json({ status: 'success', message: '成功新增推文內容！' })
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  },
  getTweet: async (req, res, next) => {
    // 取得 tweet 與其相關回文
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'replyCounts', 'likeCounts', 'createdAt'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }]
      })
      // 時間格式整理
      tweet = {
        ...tweet,
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
      }
      return res.json(tweet)
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  }
}

module.exports = tweetController