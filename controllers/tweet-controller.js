const { Tweet, User, Reply, Like, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      attributes: {
        exclude: ['UserId'],
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts']]
      },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    })
      .then(tweets => res.status(200).json(tweets))
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      raw: true,
      nest: true,
      attributes: {
        exclude: ['UserId'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCounts'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCounts']]
      },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
    })
      .then(tweet => {
        if (!tweet) {
          const error = new Error('此推文不存在！')
          error.status = 404
          throw error
        }
        return res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) {
        const error = new Error('內容不可空白！')
        error.status = 400
        throw error
      }
      if (description.length > 140) {
        const error = new Error('內容上限 140 字！')
        error.status = 400
        throw error
      }
      const user = await User.findByPk(getUser(req).dataValues.id)
      if (!user) throw new Error('使用者不存在!')
      const tweet = await Tweet.create({
        UserId: getUser(req).dataValues.id,
        description
      })

      const data = {
        ...tweet.dataValues,
        user: user.dataValues
      }
      Object.keys(data.user).forEach(e => {
        if (!['id', 'name', 'account', 'avatar'].includes(e)) return delete data.user[e]
      })
      delete data.UserId

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: (req, res, next) => {
    const TweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        where: { TweetId },
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      })
    ])
      .then(([tweet, replies]) => {
        if (!tweet) {
          const error = new Error('此推文不存在！')
          error.status = 404
          throw error
        }
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  postTweetReplies: async (req, res, next) => {
    try {
      const UserId = getUser(req).dataValues.id
      const TweetId = req.params.tweet_id
      const { comment } = req.body

      if (!comment) {
        const error = new Error('內容不可空白！')
        error.status = 400
        throw error
      }
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        const error = new Error('此推文不存在！')
        error.status = 404
        throw error
      }
      const user = await User.findByPk(UserId)
      if (!user) throw new Error('使用者不存在!')

      const reply = await Reply.create({ TweetId, comment, UserId })

      const data = {
        ...reply.dataValues,
        user: user.dataValues
      }
      Object.keys(data.user).forEach(e => {
        if (!['id', 'name', 'account', 'avatar'].includes(e)) return delete data.user[e]
      })
      delete data.UserId
      delete data.TweetId

      return res.status(200).json(data)
    } catch (err) { next(err) }
  },
  postTweetLike: (req, res, next) => {
    const UserId = getUser(req).dataValues.id
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: { TweetId, UserId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          const error = new Error('此推文不存在！')
          error.status = 404
          throw error
        }
        if (like) {
          const error = new Error('使用者已按讚此推文！')
          error.status = 400
          throw error
        }
        return Like.create({
          UserId, TweetId
        })
      })
      .then(createdLike => {
        const data = { ...createdLike.toJSON(), tweet: { id: TweetId } }
        delete data.UserId
        delete data.TweetId
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  postTweetUnlike: (req, res, next) => {
    const UserId = getUser(req).dataValues.id
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: { TweetId, UserId }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          const error = new Error('此推文不存在！')
          error.status = 404
          throw error
        }
        if (!like) {
          const error = new Error('使用者未按讚此推文！')
          error.status = 400
          throw error
        }
        return like.destroy()
      })
      .then(destroyLike => {
        const data = { ...destroyLike.toJSON(), tweet: { id: TweetId } }
        delete data.UserId
        delete data.TweetId
        res.status(200).json(data)
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
