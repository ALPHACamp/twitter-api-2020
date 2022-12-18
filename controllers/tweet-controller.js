const { Tweet, User, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const tweetController = {
  postTweet: (req, res, next) => {
    const UserId = getUser(req).id
    const { description } = req.body
    if (description.length > 140) return res.status(500).json({ status: '內容不可超出140字' })
    return Tweet.create({
      UserId,
      description
    }).then(postedTweet => res.status(200).json({ status: 'success', postedTweet })
    ).catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const currentUserId = getUser(req).id
    return Tweet.findAll({
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
    const currentUserId = getUser(req).id
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
  }
}

module.exports = tweetController
