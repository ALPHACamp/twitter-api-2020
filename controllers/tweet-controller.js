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
  getTweets: (req, res, next) => {
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []
    Tweet.findAll({
      include: [
        { model: User, attributes: { exclude: 'password' } },
        Like,
        Reply
      ],
      order: [['createdAt', 'DESC']],
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(tweet => {
          tweet = tweet.toJSON()
          tweet.likesCount = tweet.Likes.length
          tweet.repliesCount = tweet.Replies.length
          tweet.isLiked = likedTweetsId.includes(tweet.id)
          delete tweet.Likes
          delete tweet.Replies
          return tweet
        })
        return res.json(data)
      })
      .catch(err => next(err))
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
  likeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = req.params.id
    Promise.all([
      Like.findOne({ where: { TweetId, UserId } }),
      Tweet.findByPk(TweetId)
    ])
      .then(([like, tweet]) => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        if (like) throw new Error('已經按過讚了！')
        return Like.create({ UserId, TweetId })
      })
      .then(newLike => res.json({ status: 'success', data: { like: newLike } }))
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id
    Promise.all([
      Like.findOne({ where: { TweetId, UserId } }),
      Tweet.findByPk(TweetId)
    ])
      .then(([like, tweet]) => {
        if (!tweet) {
          const err = new Error('推文不存在！')
          err.status = 404
          throw err
        }
        if (!like) throw new Error('你還沒讚過這則推文！')
        return like.destroy()
      })
      .then(deletedLike => res.json({ status: 'success', data: { like: deletedLike } }))
      .catch(err => next(err))
  }
}

module.exports = tweetController
