const { Tweet, User, sequelize, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const tweetController = {
  postTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (description.length > 140) res.status(400).json({ status: 'error', message: '內容不可超出140字' })
    return Tweet.create({
      UserId,
      description
    }).then(postedTweet => res.status(200).json({ status: 'success', data: postedTweet })
    ).catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    return Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      attributes: ['id', 'description', 'createdAt',
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount']
      ]
    })
      .then(tweets => {
        if (!tweets) res.status(404).json({ status: 'error', message: '貼文不存在' })
        const data = tweets.map(t => ({
          ...t,
          isLiked: UserId?.Likes?.some(UserLike => UserLike?.TweetId === t.id),
          createdAt: relativeTime(t.createdAt)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    return Tweet.findByPk(req.params.tweet_id, {
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      attributes: [
        'id',
        'description',
        'createdAt',
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount']
      ]
    }).then(tweet => {
      if (!tweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
      const data = tweet
      data.createdAt = relativeTime(data.createdAt)
      data.isLiked = UserId?.Likes?.some(UserLike => UserLike?.TweetId === tweet.id)
      return res.status(200).json(data)
    }).catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    return Promise.all([Tweet.findByPk(TweetId), Reply.findAll({
      where: { TweetId },
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })])
      .then(([tweet, replies]) => {
        if (!tweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    const UserId = helpers.getUser(req).id
    const { comment } = req.body
    if (!comment || (comment.trim() === '')) res.status(422).json({ status: 'error', message: '回覆內容不可空白!' })
    if (comment.length > 140) res.status(422).json({ status: 'error', message: '回覆字數超出140字限制!' })
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        return Reply.create({
          TweetId,
          UserId,
          comment
        })
      })
      .then(reply => {
        res.status(200).json(reply)
      })
      .catch(err => next(err))
  },
  likeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req).id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
      .then(([tweet, likedTweet]) => {
        if (!tweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        if (likedTweet) return res.status(422).json({ status: 'error', message: '已經按讚過了!' })
        return Like.create({
          TweetId,
          UserId
        })
      })
      .then(like => res.status(200).json(like))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    const UserId = helpers.getUser(req).id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          TweetId,
          UserId
        }
      })
    ])
      .then(([tweet, likedTweet]) => {
        if (!tweet) res.status(404).json({ status: 'error', message: '貼文不存在!' })
        if (!likedTweet) return res.status(422).json({ status: 'error', message: '還沒有按讚過喔!' })
        return likedTweet.destroy()
      })
      .then(unlike => res.status(200).json(unlike))
      .catch(err => next(err))
  }
}
module.exports = tweetController
