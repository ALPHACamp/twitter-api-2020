const sequelize = require('sequelize')
const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'userId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${userId} > 0)`), 'isLiked']
      ],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return res.json(
          tweets
        )
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.id
    return Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt', 'userId',
        [sequelize.literal('(SELECT COUNT (*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`(SELECT COUNT (*) FROM Likes WHERE Likes.Tweet_id = Tweet.id AND Likes.User_id = ${userId} > 0)`), 'isLiked']
      ],
      raw: true,
      nest: true
    })
      .then(tweet => {
        return res.json(
          tweet
        )
      })
      .catch(err => next(err))
  },
  getTweetReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    Promise.all([
      Reply.findAll({
        where: { tweetId },
        order: [['createdAt', 'DESC']],
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      }),
      Tweet.findByPk(tweetId, {
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      })
    ])
      .then(([replies, tweet]) => {
        replies = replies.map(reply => {
          reply = {
            ...reply.toJSON(),
            repliesAccount: tweet.User.account
          }
          return reply
        })
        return res.json(
          replies
        )
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const userId = helpers.getUser(req).id
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('內容不可超過 140 字')
    return Tweet.create({
      description,
      userId
    })
      .then(tweet => {
        return res.json({
          status: 'success',
          tweet
        })
      })
      .catch(err => next(err))
  },
  postTweetReply: (req, res, next) => {
    const { tweetId } = req.params
    const userId = helpers.getUser(req).id
    const { comment } = req.body
    if (!comment) throw new Error('留言不得為空白')
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('找不到這篇 tweet')
        return Reply.create({
          comment,
          userId,
          tweetId
        })
          .then(reply => {
            return res.json({
              status: 'success',
              message: '成功貼出留言',
              reply
            })
          })
      })
      .catch(err => next(err))
  },
  postTweetLike: (req, res, next) => {
    const { id } = req.params
    const userId = helpers.getUser(req).id
    Promise.all([
      Tweet.findByPk(id, {
        raw: true,
        nest: true
      }),
      Like.findOne({
        where: { tweetId: id, userId },
        raw: true,
        nest: true
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('這篇貼文不存在')
        if (like) throw new Error('你已按讚這篇貼文')
        return Like.create({
          tweetId: id,
          userId
        })
      })
      .then(() => res.json({ status: 'success' }))
      .catch(err => next(err))
  },
  postTweetUnlike: (req, res, next) => {
    const { id } = req.params
    const userId = helpers.getUser(req).id
    Promise.all([
      Tweet.findByPk(id, {
        raw: true,
        nest: true
      }),
      Like.findOne({
        where: { tweetId: id, userId },
        raw: true,
        nest: true
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error('這篇貼文不存在')
        if (!like) throw new Error('你沒有按讚這篇貼文')
        return Like.destroy({
          where: {
            tweetId: id,
            userId
          }
        })
      })
      .then(() => res.json({ status: 'success' }))
      .catch(err => next(err))
  }
}

module.exports = tweetController
