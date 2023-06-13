const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) {
        return res.status(404).json({ status: 'error', message: "Tweets didn't exist!" })
      }
      const data = tweets.map(tweet => {
        return {
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          account: tweet.User.account,
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          likedCount: tweet.Likes.length,
          repliedCount: tweet.Replies.length,
          isLiked: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const id = req.params.tweet_id
      console.log(req.params)
      const tweet = await Tweet.findByPk(id,
        {
          include: [
            { model: User, attributes: ['name', 'avatar', 'account'] },
            Like,
            Reply,
            { model: User, as: 'LikedUsers' }]
        })
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: "Tweet didn't exist!" })
      }
      const data = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLike: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
      }
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) {
        return res.status(400).json({ status: 'error', message: 'Please input tweet.' })
      }
      if (description && description.length > 140) {
        return res.status(409).json({ status: 'error', message: "Tweet can't be more than 140 words." })
      }
      const data = await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  putTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) return res.status(404).json({ status: 'error', message: "Tweet didn't exist!" })
      const data = await tweet.update({ description: req.body.description })
      return res.status(200).json({ status: 'success', data })
    } catch (error) {
      next(error)
    }
  },
  postLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(
        TweetId,
        { include: User }
      )
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: "Tweet didn't exist!" })
      }
      const likedTweetAuthor = tweet.dataValues.User.dataValues.account
      const isLiked = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (isLiked) {
        return res.status(400).json({ status: 'error', message: 'You have liked this tweet.' })
      }
      const createdLike = await Like.create({ UserId, TweetId })
      return res.status(200).json({
        status: 'success',
        data: {
          id: createdLike.id,
          UserId: createdLike.UserId,
          TweetId: createdLike.TweetId,
          likedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(
        TweetId, { include: User }
      )
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: "Tweet didn't exist!" })
      }
      const unlikedTweetAuthor = tweet.dataValues.User.dataValues.account
      const isliked = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (!isliked) { return res.status(400).json({ status: 'error', message: "You haven't liked this tweet" }) }
      const deletedLike = await isliked.destroy()
      return res.status(200).json({
        status: 'success',
        data: {
          id: deletedLike.id,
          Userid: deletedLike.UserId,
          Tweetid: deletedLike.TweetId,
          unlikedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { tweetId: req.params.tweet_id },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          { model: Tweet, include: User }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (replies.length === 0) {
        return res.status(404).json({ status: 'error', message: "Replies didn't exist." })
      }
      const data = replies.map(reply => {
        return {
          id: reply.id,
          userId: reply.UserId,
          tweetId: reply.TweetId,
          tweetAuthorAccount: reply.Tweet.User.account,
          comment: reply.comment,
          createdAt: reply.createdAt,
          commentAccount: reply.User.account,
          name: reply.User.name,
          avatar: reply.User.avatar
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId, { include: User })
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: "Tweet didn't exist." })
      }
      const repliedTweetAuthor = tweet.dataValues.User.dataValues.account
      const { comment } = req.body
      if (!comment) {
        return res.status(400).json({ status: 'error', message: 'Please input comment.' })
      }
      if (comment && comment.length > 50) {
        return res.status(409).json({ status: 'error', message: "Comment can't be more than 50 words." })
      }
      const createdReply = await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId,
        comment
      })
      return res.status(200).json({
        status: 'success',
        data: {
          id: createdReply.id,
          UserId: createdReply.UserId,
          TweetId: createdReply.TweetId,
          comment: createdReply.comment,
          repliedTweetAuthor
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
