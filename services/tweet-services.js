const sequelize = require('sequelize')
const { User, Tweet, Reply, Like } = require('./../models')
const helpers = require('../_helpers')
const tweetServices = {
  getTweets: (req, cb) => {
    const userId = helpers.getUser(req).id
    return Tweet.findAll({
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE tweet_id = Tweet.id AND user_id = ${userId})`), 'isLiked']
      ],
      include: [{
        model: User,
        attributes: ['id', 'avatar', 'name', 'account']
      }],
      raw: true,
      nest: true,
      order: [['id', 'DESC']]
    })
      .then(datas => {
        const tweets = datas.map(data => ({
          ...data,
          isLiked: data.isLiked === 1
        }))
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const { tweetId } = req.params
    const userId = helpers.getUser(req).id
    return Tweet.findByPk(tweetId, {
      attributes: [
        'id', 'description', 'createdAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)'), 'replyCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE tweet_id = Tweet.id AND user_id = ${userId})`), 'isLiked']
      ],
      include: [{ model: User, attributes: ['id', 'avatar', 'account', 'name'] }],
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在!')
        tweet.isLiked = tweet.isLiked === 1
        cb(null, tweet)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const description = req.body.description
    const UserId = helpers.getUser(req).id
    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return Tweet.create({
          description,
          UserId
        })
      })
      .then(postedTweet => cb(null, postedTweet))
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const { comment } = req.body
    const TweetId = req.params.tweetId
    const UserId = helpers.getUser(req).id
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在!')
        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(postedReply => cb(null, { success: true, postedReply }))
      .catch(err => cb(err))
  },
  getReplies: (req, cb) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId, {
      include: { model: User, attributes: ['id', 'account', 'avatar', 'name'] }
    })
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在!')
        return Reply.findAll({
          where: { TweetId },
          attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Tweet,
              attributes: ['id'],
              include: [{ model: User, attributes: ['account'] }]
            },
            { model: User, attributes: ['id', 'avatar', 'account', 'name'] }
          ],
          raw: true,
          nest: true,
          order: [['id', 'DESC']]
        })
      })
      .then(replies => {
        cb(null, replies)
      })
      .catch(err => cb(err))
  },
  likeTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Promise.all([
      User.findByPk(UserId),
      Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
    ])
      .then(([user, like]) => {
        if (!user) throw new Error('使用者不存在!')
        if (like) throw new Error('您已經按讚過了!')
        return Like.create({
          TweetId,
          UserId
        })
      })
      .then(result => {
        cb(null, { success: true, result })
      })
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error('您尚未對此推文按讚')
        return like.destroy()
      })
      .then(deletedLike => cb(null, { success: true, deletedLike }))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices
