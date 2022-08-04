const { Tweet, User, Reply, Like, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  add: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { description } = req.body

      if (!description) throw new Error('內容不可空白')
      if (description.length > 140) throw new Error('推文內容提交字數過長')

      const data = await Tweet.create({
        UserId,
        description
      })
      res.status(200).json({
        status: 'Success',
        message: '您已成功推文',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  get: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId, {
        attributes: [
          'id', 'description', 'UserId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCount']
        ],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }]
      })
      if (!tweet) throw new Error('沒有該則推文')
      const data = tweet.toJSON()

      const replies = await Reply.findAll({
        where: { TweetId },
        attributes: ['id', 'comment', 'UserId', 'createdAt'],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })
      const likedList = await Like.findAll({
        where: { UserId: currentUserId },
        raw: true
      })
      const isLikedId = likedList.map(like => like.TweetId)
      data.isLike = isLikedId?.includes(data.id) || false

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(data)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '您已成功！',
          data,
          replies
        })
      }
    } catch (err) {
      next(err)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        attributes: [
          'id', 'description', 'UserId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCount']
        ],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        order: [['created_at', 'DESC']],
        nest: true,
        raw: true
      })

      const likedList = await Like.findAll({
        where: { UserId: currentUserId },
        raw: true
      })
      const isLikedId = likedList.map(like => like.TweetId)
      const data = tweets.map(isLike => ({
        ...isLike,
        isLike: isLikedId?.includes(isLike.id) || false,
      }))

      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(data)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '您已成功！',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController