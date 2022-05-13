const { Tweet, User, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getAllTweet: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id', 'description', 'user_id',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCounts']
        ],
        include: [
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        ],
        order: [
          ['created_at', 'DESC']
        ],
        nest: true,
        raw: true
      })

      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      // catch this tweet including replies & likes
      // catch tweet's author
      const tweet = await Tweet.findByPk(tweetId, {
        attributes: [
          'id', 'description', 'user_id',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCounts']
        ],
        include: [
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        ]
      })

      if (!tweet) throw new Error('無法查看不存在的推文！')

      res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const description = req.body.description

      if (!description) throw new Error('不可以提交空白的推文。')
      if (description.length > 140) throw new Error('不可以提交字數過長的推文。')

      const rawTweets = await Tweet.create({
        userId,
        description
      })

      const newTweet = rawTweets.toJSON()

      res.status(200).json({
        status: 'success',
        message: '已成功新增一筆推文！',
        data: {
          newTweet
        }
      })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('無法喜歡不存在的推文。')

      const [isLiked, created] = await Like.findOrCreate({
        where: {
          userId,
          tweetId
        },
      })

      if (!created) throw new Error('你已經喜歡過該則推文。')

      res.status(200).json({
        status: 'success',
        message: '你已成功喜歡該則推文。',
        data: {
          isLiked
        }
      })
    } catch (err) {
      next(err)
    }
  },
  deleteLikeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('無法喜歡不存在的推文。')

      const isLiked = await Like.destroy({
        where: {
          userId,
          tweetId
        }
      })

      if (!isLiked) throw new Error('你沒有喜歡過該則推文。')

      res.status(200).json({
        status: 'success',
        message: '你已成功取消喜歡該則推文。',
        data: {
          deletedTweet: tweet.toJSON(), // deleted tweet
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweetAllReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('無法查找不存在的推文。')

      const replies = await Reply.findAll({
        where: {
          tweetId: req.params.id
        },
        include: [
          { model: User, attributes: ['name', 'account', 'avatar'] }
        ],
        order: [['created_at', 'DESC']],
        rest: true,
        raw: true
      })

      res.status(200).json({
        status: 'success',
        data: {
          replies
        }
      })
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id
      const comment = req.body.comment

      if (!comment) throw new Error('不可以提交空白的推文。')

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('想要回覆的貼文不存在。')

      const reply = await Reply.create({
        comment,
        userId,
        tweetId
      })

      res.status(200).json({
        status: 'success',
        message: '你已成功建立一筆留言。',
        data: {
          comment
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController