const { Tweet, User, sequelize, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const tweetController = {
  postTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (description.length > 140) return res.status(400).json({ status: 'error', message: '內容不可超出140字' })
    return Tweet.create({
      UserId,
      description
    }).then(postedTweet => res.status(200).json({ status: 'success', data: postedTweet })
    ).catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
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
        if (!tweets) throw new Error('貼文不存在!')
        const data = tweets.map(t => ({
          ...t,
          isLiked: currentUserId?.Likes?.some(currentUserLike => currentUserLike?.TweetId === t.id),
          createdAt: relativeTime(t.createdAt)
        }))
        res.status(200).json(data)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
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
      if (!tweet) res.status(500).json({ status: 'error', message: '貼文不存在' })
      const data = tweet
      data.createdAt = relativeTime(data.createdAt)
      data.isLiked = currentUserId?.Likes?.some(currentUserLike => currentUserLike?.TweetId === tweet.id)
      return res.status(200).json(data)
    }).catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    return Reply.findAll({
      where: { TweetId },
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const TweetId = Number(req.params.tweet_id)
    const UserId = helpers.getUser(req).id
    const { comment } = req.body
    // 打空白也無法送出回覆
    if (!comment || (comment.trim() === '')) throw new Error('內容不可空白')
    if (comment.length > 140) throw new Error('回覆字數超出限制')
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
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
        if (!tweet) throw new Error('推文不存在')
        if (likedTweet) throw new Error('已經按讚過了!')
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
        if (!tweet) throw new Error('推文不存在')
        if (!likedTweet) throw new Error('還沒有按讚過喔!')
        return likedTweet.destroy()
      })
      .then(unlike => res.status(200).json(unlike))
      .catch(err => next(err))
  }
}
module.exports = tweetController
