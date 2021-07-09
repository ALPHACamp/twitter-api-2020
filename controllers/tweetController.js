const db = require('../models')
const { Tweet, User, Like, Reply } = db
const validator = require('validator')

const TweetController = {
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          User,
          Reply,
          Like,
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any tweets in db.' })
      }
      tweets = tweets.map(tweet => {
        return {
          status: 'success',
          message: 'Get the tweets successfully',
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
      })
      return res.status(200).json(tweets)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getTweet: async (req, res) => {
    try {
      const id = req.params.tweet_id
      const tweet = await Tweet.findByPk(id,
        {
          include: [
            User,
            Like,
            Reply,
            { model: User, as: 'LikedUsers' }]
        })
      if (!tweet) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this tweet in db.' })
      }
      return res.status(200).json({
        status: 'success',
        message: 'Get the tweet successfully',
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        LikeCount: tweet.Likes.length,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        likedCount: tweet.Likes.length,
        repliedCount: tweet.Replies.length,
        isLike: tweet.LikedUsers.map(t => t.id).includes(req.user.id)
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  postTweet: async (req, res) => {
    try {
      const { description } = req.body
      if (!description) {
        return res.status(400).json({ status: 'error', message: 'Please input tweet.' })
      }
      if (description && !validator.isByteLength(description, { min: 0, max: 140 })) {
        return res.status(409).json({ status: 'error', message: 'tweet can\'t be more than 140 words.' })
      }
      await Tweet.create({
        UserId: req.user.id,
        description
      })
      return res.status(200).json({ status: 'success', message: 'The tweet was successfully created.' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  getReplies: async (req, res) => {
    try {
      let replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: [User]
      })
      if (!replies) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any replies in db.' })
      }
      replies = replies.map(reply => {
        return {
          id: reply.id,
          UserId: reply.UserId,
          TweetId: reply.TweetId,
          comment: reply.comment,
          createdAt: reply.createdAt,
          account: reply.User.account,
          createdAt: reply.User.createdAt,
          name: reply.User.name,
          avatar: reply.User.avatar
        }
      })
      return res.status(200).json(replies)
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  postReply: async (req, res) => {
    if (!req.body.comment) { return res.status(204).json({ status: 'error', message: 'Please input comment' }) } else if (req.body.comment.length >= 50) { return res.status(409).json({ status: 'error', message: 'comment can\'t be more than 50 words' }) } else {
      await Reply.create({
        UserId: req.user.id,
        TweetId: req.params.tweet_id,
        comment: req.body.comment
      })
        .then((reply) => { res.status(200).json({ status: 'success', message: 'The comment was successfully created' }) })
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })
    }
  },
  postLike: async (req, res) => {
    const liked = await Like.findOne({
      where: { UserId: req.user.id, TweetId: req.params.id }
    })
    if (liked) { res.status(400).json({ status: 'error', message: 'error' }) } else {
      Like.create({ UserId: req.user.id, TweetId: req.params.id })
        .then(like => { res.status(200).json({ status: 'success', message: 'The like was successfully created' }) })
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })
    }
  },
  postUnlike: async (req, res) => {
    const liked = await Like.findOne({
      where: { UserId: req.user.id, TweetId: req.params.id }
    })
    if (!liked) { res.status(400).json({ status: 'error', message: 'error' }) } else {
      liked.destroy()
        .then(like => { res.status(200).json({ status: 'success', message: 'The like was successfully deleted' }) })
        .catch(error => {
          console.log('error')
          res.status(500).json({ status: 'error', message: 'error' })
        })
    }
  }

}

module.exports = TweetController
