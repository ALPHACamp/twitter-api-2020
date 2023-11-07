const { Tweet, User, Reply, Like } = require('../models')
const {
  relativeTimeFromNow,
  formatDate,
  formatTime
} = require('../helpers/dayjs-helpers')
const helpers = require('../_helpers')

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
        isLiked: tweet.LikedUsers?.some(like => like.TweetId === tweet.id) || false,
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
        throw new Error('內容不可空白')
      } else if (description.length > 140) {
        throw new Error('推文字數不可超過140字！')
      }

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
      const repliesData = tweet.Replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: relativeTimeFromNow(reply.createdAt)
      }))
      const data = {
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        createdAtDate: formatDate(tweet.createdAt),
        createdAtTime: formatTime(tweet.createdAt),
        Replies: repliesData,
        isLiked:
          tweet.LikedUsers?.some(like => like.TweetId === tweet.id) || false,
        likesAmount: tweet.LikedUsers.length || 0
      }

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id

      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({
          where: { UserId, TweetId }
        })
      ])

      if (!tweet) {
        throw new Error('推文不存在！')
      } else if (like) {
        throw new Error('你已經對這則推文按過喜歡！')
      }

      await Like.create({
        UserId,
        TweetId
      })

      const isLiked = true
      const likeCount = await Like.count({ where: { TweetId } })

      return res.status(200).json({
        status: 'success',
        message: '成功對這則推文按下喜歡！',
        likedTweet: {
          ...tweet.toJSON(),
          isLiked,
          likeCount
        }
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id

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
  },
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const replies = await Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })

      const tweet = await Tweet.findByPk(TweetId, {
        include: [
          { model: User, attributes: ['account'] } // 可得知回覆的推文是誰的
        ]
      })
      if (!tweet || !replies) {
        throw new Error(!tweet ? '推文不存在！' : '此篇推文目前沒有回覆。')
      }

      const data = replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: relativeTimeFromNow(reply.createdAt),
        tweet
      }))

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const { comment } = req.body

      if (!comment || comment.length > 140) {
        throw new Error(
          !comment ? '內容不可空白' : '回覆字數不可超過140字！'
        )
      }

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        throw new Error('推文不存在！')
      }

      const reply = await Reply.create({
        comment,
        TweetId: tweetId,
        UserId: req.user.id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發表回覆！',
        reply
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
