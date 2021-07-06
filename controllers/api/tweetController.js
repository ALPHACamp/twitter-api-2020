const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply
const helper = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like]
      })
      tweets = tweets.map(tweet => ({
        ...tweet.dataValues,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: helper.getUser(req).Likes.map(like => like.dataValues.TweetId).includes(tweet.id)
      }))
      return res.json(tweets)
    } catch (error) {
      console.log(error)
    }
  },
  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [User, Reply, Like]
      })
      tweet = {
        tweet,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }
      return res.json(tweet.tweet)
    } catch (error) {
      console.log(error)
    }
  },
  addTweet: async (req, res) => {
    try {
      const description = req.body.description
      if (description.trim() === '') {
        return res.json({ status: 'error', message: "Content didn't exist" })
      }
      if (description.length > 140) {
        return res.json({ status: 'error', message: 'Word limit exceeded' })
      }
      await Tweet.create({
        UserId: helper.getUser(req).id,
        description: req.body.description
      })
      return res.json({ status: 'success', message: 'Tweet was successfully posted' })
    } catch (error) {
      console.log(error)
    }
  },
  updateTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        return res.json({ status: 'error', message: "content didn't exist" })
      }
      const tweet = await Tweet.findByPk(req.params.id)
      if (helper.getUser(req).id !== tweet.dataValues.UserId) {
        return res.json({ status: 'error', message: 'Permission denied' })
      }

      await tweet.update({
        description: req.body.description
      })
      return res.json({ status: 'success', message: 'This tweet was successfully update' })
    } catch (error) {
      console.log(error)
    }
  },
  removeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (helper.getUser(req).id !== tweet.dataValues.UserId) {
        return res.json({ status: 'error', message: 'Permission denied' })
      }
      await tweet.destroy()
      return res.json({ status: 'success', message: 'This tweet was successfully remove' })
    } catch (error) {
      console.log(error)
    }
  },
  likeTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({ status: 'error', message: "This post doesn't exist" })
      }
      const like = await Like.findOne({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.id
        }
      })
      if (like) {
        return res.json({ status: 'error', message: 'You already liked this post!' })
      }
      await Like.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.id
      })
      return res.json({ status: 'success', message: 'You like this post!' })
    } catch (error) {
      console.log(error)
    }
  },
  unlikeTweet: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.id
        }
      })
      if (!like) {
        return res.json({ status: 'error', message: "This post doesn't in your liked list." })
      }
      await like.destroy()
      return res.json({ status: 'success', message: 'Unlike this post successfully' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = tweetController
