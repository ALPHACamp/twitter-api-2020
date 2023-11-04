const { Tweet, User, Reply, Like } = require('../models')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: Reply },
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        repliesAmount: tweet.Replies.length || 0,
        likesAmount: tweet.LikedUsers.length || 0
      }))

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body

      if (!description) {
        throw new Error('內容不可空白！')
      } else if (description.length > 140) { throw new Error('推文字數不可超過140字！') }

      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發佈推文！',
        tweet
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
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
        order: [[{ model: Reply }, 'createdAt', 'DESC']]
      })
      const data = {
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        repliesAmount: tweet.Replies.length || 0,
        likesAmount: tweet.LikedUsers.length || 0,
      };

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = req.user.id

      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) throw new Error('推文不存在！')
      if (like) throw new Error('你已經對這則推文按過喜歡！')

      await Like.create({
        UserId,
        TweetId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功對這則推文按下喜歡！',
        likedTweet: tweet
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = req.user.id

      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) throw new Error('推文不存在！')
      if (!like) throw new Error('你尚未對這篇推文按下喜歡！')

      await like.destroy()

      return res.status(200).json({
        status: 'success',
        message: '成功取消對這則推文按下喜歡！',
        likedTweet: tweet
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
