const { Tweet, User, Reply } = require('../models')
const { relativeTimeFromNow, formatDate, formatTime } = require('../helpers/dayjs-helpers')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          },
          { model: Reply },
          {
            model: User,
            as: 'LikedUsers',
            attributes: ['id', 'account', 'name']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      if (!tweets) throw new Error('目前沒有任何推文。')

      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt), // 推文的時間以 相對時間 為概念
        repliedAmount: tweet.Replies.length || 0,
        likedAmount: tweet.LikedUsers.length || 0
      }))

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId, {
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          },
          {
            model: Reply,
            include: [
              { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
            ]
          },
          {
            model: User,
            as: 'LikedUsers',
            attributes: ['id', 'account', 'name', 'avatar']
          }
        ],
        order: [
          [{ model: Reply }, 'createdAt', 'DESC'] // 推文的回覆依時間由新到舊排序
        ]
      })

      if (!tweet) throw new Error('推文不存在！')

      // 回覆的時間以 相對時間 為概念
      const repliesData = tweet.Replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: relativeTimeFromNow(reply.createdAt)
      }))
      const data = {
        ...tweet.toJSON(),
        createdAtDate: formatDate(tweet.createdAt), // 提供推文需要的日期格式
        createdAtTime: formatTime(tweet.createdAt), // 提供推文需要的時間格式
        Replies: repliesData,
        repliedAmount: tweet.Replies.length || 0,
        likedAmount: tweet.LikedUsers.length || 0
      }

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body

      if (!description) throw new Error('推文內容不可空白！')
      if (description.length > 140) throw new Error('推文字數不可超過140字！')

      const tweet = await Tweet.create({
        description,
        UserId: helpers.getUser(req).id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發佈推文！',
        tweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
