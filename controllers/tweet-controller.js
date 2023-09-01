const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const Sequelize = require('sequelize')

const tweetController = {
  getTweet: async (req, res, next) => {
    try {
      const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: { model: User, attributes: { exclude: 'password' } },
        attributes: {
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'), 'repliesCount']
          ]
        },
        raw: true,
        nest: true
      })
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      tweet.isLiked = likedTweetsId.some(id => id === tweet.id)
      return res.json(tweet)
    } catch (err) {
      return next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: { exclude: 'password' } },
        attributes: {
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`TweetId` = `Tweet`.`id`)'), 'likesCount'],
            [Sequelize.literal('(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`TweetId` = `Tweet`.`id`)'), 'repliesCount']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const data = tweets.map(tweet => {
        tweet.isLiked = likedTweetsId.some(id => id === tweet.id)
        return tweet
      })
      return res.json(data)
    } catch (err) {
      return next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) throw new Error('所有欄位都是必填！')
      if (description.length > 140) throw new Error('推文字數超過上限。')
      const newTweet = await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      return res.json({ status: 'success', data: { tweet: newTweet } })
    } catch (err) {
      return next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: {
          model: Reply,
          include: { model: User, attributes: { exclude: 'password' } },
          order: [['createdAt', 'DESC']]
        },
        nest: true
      })
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      return res.json(tweet.Replies)
    } catch (err) {
      return next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) throw new Error('所有欄位都是必填！')
      if (comment.length > 140) throw new Error('留言字數超過上限。')
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      const newReply = await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
        comment
      })
      return res.json({ status: 'success', data: { reply: newReply } })
    } catch (err) {
      return next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({ where: { UserId, TweetId } })
      ])
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      if (like) throw new Error('已經按過讚了！')
      const newLike = await Like.create({ UserId, TweetId })
      return res.json({ status: 'success', data: { like: newLike } })
    } catch (err) {
      return next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(TweetId),
        Like.findOne({ where: { UserId, TweetId } })
      ])
      if (!tweet) {
        const err = new Error('推文不存在！')
        err.status = 404
        throw err
      }
      if (!like) throw new Error('你還沒讚過這則推文！')
      const deletedLike = await like.destroy()
      return res.json({ status: 'success', data: { like: deletedLike } })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
