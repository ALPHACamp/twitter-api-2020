const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { absoluteTimeFormat, relativeTimeFormat } = require('../helpers/day-helpers')
const sequelize = require('sequelize')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      include: [
        { model: User, attributes: ['avatar', 'name', 'account'] },
        { model: Reply, attributes: ['id', 'TweetId'] },
        { model: Like, attributes: ['id', 'tweetId'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const data = tweets.map(tweet => {
          const subDescription = tweet.description.length > 80 ? tweet.description.substring(0, 80) + '...' : tweet.description
          return {
            ...tweet.dataValues,
            description: subDescription,
            createdAt: relativeTimeFormat(tweet.createdAt),
            replyCount: tweet.Replies.length,
            likeCount: tweet.Likes.length
          }
        })
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { id } = req.params
    Tweet.findByPk(id, {
      raw: true,
      nest: true,
      attributes: ['id', 'description', 'createdAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
      ],
      include: [
        { model: User, attributes: ['avatar', 'name', 'account'] }
      ]
    }).then(tweet => {
      if (!tweet) throw new Error('推文不存在！')
      const data = {
        ...tweet,
        absoluteTime: absoluteTimeFormat(tweet.createdAt),
        relativeTime: relativeTimeFormat(tweet.createdAt)
      }
      return cb(null, data)
    })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    // const UserId = req.user.dataValues.id
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!UserId) throw new Error('用戶不存在！')
    if (!description) throw new Error('內容不可空白')
    if (description.length > 140) throw new Error('內容不得超過140字！')
    return Tweet.create({ description, UserId })
      .then(newTweet => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    if (!UserId) throw new Error('用戶不存在！')
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { UserId, TweetId } })
    ]).then(([tweet, like]) => {
      if (!tweet) throw new Error('推文不存在！')
      if (like) throw new Error('您已 like 過此篇推文！')
      return Like.create({ UserId, TweetId })
        .then(data => cb(null, {
          message: '已成功按讚！',
          isLiked: !like,
          data
        }))
        .catch(err => cb(err))
    })
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    if (!UserId) throw new Error('用戶不存在！')
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { UserId, TweetId } })
    ]).then(([tweet, like]) => {
      if (!tweet) throw new Error('推文不存在！')
      if (!like) throw new Error('您還沒 like 此篇推文！')
      return like.destroy()
        .then(data => cb(null, {
          message: '已成功收回讚！',
          isLiked: !like,
          data
        }))
        .catch(err => cb(err))
    })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
