const { Tweet, User, sequelize, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        attributes: ['UserId', 'comment', 'createdAt'],
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) AS replyCounts FROM replies
          WHERE Tweet_id = tweet.id)`), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(*) AS likeCounts FROM likes WHERE Tweet_id = tweet.id)'), 'likeCounts']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const loginUser = getUser(req).id
      const likes = await Like.findAll({
        where: { UserId: loginUser },
        raw: true
      })
      const data = tweets.map(tweet =>
        ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id)
        })
      )
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const loginUser = getUser(req).id
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId, {
        include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) AS replyCounts FROM replies
          WHERE Tweet_id = tweet.id)`), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(*) AS likeCounts FROM likes WHERE Tweet_id = tweet.id)'), 'likeCounts']
          ]
        },
        raw: true,
        nest: true
      })
      if (!tweet) throw new Error('推文不存在')
      const likes = await Like.findAll({ where: { TweetId: tweetId } })
      const isLiked = likes.some(l => l.UserId === loginUser)
      const data = { ...tweet, isLiked }
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const loginUser = getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId, {
        attributes: {
          include: [[sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${loginUser} AND Likes.Tweet_Id = ${TweetId})`), 'isLiked']],
          exclude: ['description', 'createdAt', 'updatedAt']
        },
        raw: true
      })
      if (!tweet) throw new Error('推文不存在')
      if (tweet.isLiked) throw new Error('You have liked this tweet!')
      await Like.create({
        UserId: loginUser,
        TweetId
      })
      tweet.isLiked = 1
      res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const loginUser = getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId, {
        attributes: {
          include: [[sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${loginUser} AND Likes.Tweet_Id = ${TweetId})`), 'isLiked']],
          exclude: ['description', 'createdAt', 'updatedAt']
        },
        raw: true
      })
      if (!tweet) throw new Error('推文不存在')
      if (!tweet.isLiked) throw new Error("You haven't liked this tweet!")
      await Like.destroy({ where: { TweetId, UserId: loginUser } })
      tweet.isLiked = 0
      res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const UserId = getUser(req).id
      if (!description.trim()) throw new Error('內容不可空白')
      if (description.length > 140) throw new Error('內容不可超過140字')
      const data = await Tweet.create({
        description,
        UserId
      })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  replyTweet: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.tweet_id
      const UserId = getUser(req).id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('推文不存在')
      if (!comment.trim()) throw new Error('內容不可空白')
      if (comment.length > 140) throw new Error('內容不可超過140字')
      const data = await Reply.create({
        UserId,
        TweetId,
        comment
      })
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
