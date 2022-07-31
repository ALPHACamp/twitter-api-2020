const { Tweet, User, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  add:async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { description } = req.body

      if (!description) throw new Error('推文內容不可空白')
      if (description.length > 140) throw new Error('推文內容提交字數過長')

      const newTweet = await Tweet.create({
        userId,
        description
      })
      res.status(200).json({
        message: '您已成功推文',
        newTweet
      })
    } catch (err) {
      next(err)
    }
  },
  get:async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId, {
	      attributes: [
          'id', 'description', 'userId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCount']
        ],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })
      if (!tweet) throw new Error('沒有該則推文')

      const replies = await Reply.findAll({
        where: { tweetId },
        attributes: [ 'id', 'comment', 'userId', 'createdAt'],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })


      res.status(200).json({
        status: 'Success',
        message: '您已成功！',
        tweet,
        replies
      })
    } catch (err) {
      next(err)
    }
  },
  getAll:async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
	      attributes: [
          'id', 'description', 'userId', 'createdAt',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'),
            'likeCount'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'),
            'replyCount']
        ],
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })

      res.status(200).json({
        status: 'Success',
        message: '您已成功！',
        tweets
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController