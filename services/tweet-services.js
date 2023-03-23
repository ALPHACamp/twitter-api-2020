// const assert = require('assert')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')
const { assert } = require('chai')

const tweetServices = {
  getTweets: (req, cb) => {
    const userId = helpers.getUser(req).id
    return Tweet.findAll({
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'repliedCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Tweet_id = Tweet.id AND User_id = ${userId})`), 'isLiked']
      ],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['updatedAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweetsData => {
        const tweets = tweetsData.map(t => ({
          ...t,
          isLiked: t.isLiked === 1
        }))
        cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId, {
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'repliedCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'likedCount'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Tweet_id = Tweet.id AND User_id = ${userId})`), 'isLiked']
      ],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    })
      .then(tweetData => {
        const { ...data } = {
          ...tweetData.toJSON(),
          isLiked: tweetData.isLiked === 1
        }
        return cb(null, data)
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { description } = req.body
    const userId = helpers.getUser(req).id
    return User.findByPk(userId)
      .then(user => {
        assert(user, '使用者不存在')
        return Tweet.create({
          UserId: userId,
          description
        })
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getTweetReplies: (req, cb) => {
    const TweetId = req.params.tweetId
    return Reply.findAll({
      where: { TweetId },
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(replies => cb(null, replies))
      .catch(err => cb(err))
  },
  replyTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    const { comment } = req.body
    assert(comment, 'comment為必填')
    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(TweetId)
    ])
      .then(([user, tweet]) => {
        assert(user, '使用者不存在')
        assert(tweet, '推文不存在')
        return Reply.create({
          UserId: userId,
          TweetId,
          comment
        })
      })
      .then(replied => cb(null, { replied }))
      .catch(err => cb(err))
  },
  likeTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(TweetId)
    ])
      .then(([user, tweet]) => {
        assert(user, '使用者不存在')
        assert(tweet, '推文不存在')
        return Like.create({
          UserId: userId,
          TweetId
        })
      })
      .then(liked => cb(null, { liked }))
      .catch(err => cb(err))
  },
  unlikeTweet: (req, cb) => {
    const userId = helpers.getUser(req).id
    const TweetId = req.params.tweetId
    return Promise.all([
      User.findByPk(userId),
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: userId,
          TweetId
        }
      })
    ])
      .then(([user, tweet, like]) => {
        assert(user, '使用者不存在')
        assert(tweet, '推文不存在')
        assert(like, '尚未 like 推文')
        return like.destroy()
      })
      .then(unlike => cb(null, { unlike }))
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
