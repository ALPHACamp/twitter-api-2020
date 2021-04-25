const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  postTweets: async (req, res) => {
    try {
      let { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        return res.json({
          status: 'error',
          message: 'input should not be blank'
        })
      }

      if (description.length > 140) {
        return res.json({
          status: 'error',
          message: 'input cannot be longer than 140 characters'
        })
      }

      await Tweet.create({
        UserId,
        description,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        limit: 1,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({
        status: 'success',
        message: 'successfully posted a tweet',
        tweet
      })
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User, Reply, Like]
      })

      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res.json(tweets)
    } catch (error) {
      console.log(error)
    }
  },

  getTweet: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      let tweet = await Tweet.findByPk(TweetId, {
        include: [User, Like, Reply]
      })

      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'cannot get tweet that doesn\'t exist'
        })
      }

      const likes = helpers.getUserInfoId(req, 'LikedTweets')

      tweet = {
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        user: {
          id: tweet.User.id,
          name: tweet.User.name,
          avatar: tweet.User.avatar
        },
        likesLength: tweet.Likes.length,
        commentsLength: tweet.Replies.length,
        isLiked: likes ? likes.includes(tweet.id) : null
      }

      return res.json(tweet)
    } catch (error) {
      console.log(error)
    }
  },

  likeTweet: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const targetTweet = await Tweet.findOne({ where: { id: req.params.tweet_id } })

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'cannot like a tweet that doesn\'t exist'
        })
      }

      const like = await Like.findOne({ where: { TweetId: req.params.tweet_id, UserId } })

      if (like) {
        return res.json({
          status: 'error',
          message: 'already liked this tweet'
        })
      }

      await Like.create({
        UserId,
        TweetId: req.params.tweet_id
      })
      return res.json({ status: 'success' })
    }
    catch (error) {
      console.log(error)
    }
  },

  unlikeTweet: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const targetTweet = await Tweet.findOne({ where: { id: req.params.tweet_id } })

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'cannot unlike a tweet that doesn\'t exist'
        })
      }

      const like = await Like.findOne({
        where: {
          UserId,
          TweetId: req.params.tweet_id
        }
      })

      if (!like) {
        return res.json({
          status: 'error',
          message: 'you haven\'t liked this tweet before'
        })
      }

      await like.destroy()
      return res.json({ status: 'success' })
    }
    catch (error) {
      console.log(error)
    }
  },

  postReply: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })
      const UserId = helpers.getUser(req).id

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'cannot reply to a tweet that doesn\'t exist'
        })
      }

      const tweetAuthor = await User.findOne({ where: { id: targetTweet.UserId } })

      if (!req.body.comment.trim()) {
        return res.json({
          status: 'error',
          message: 'comment cannot be blank'
        })
      }

      await Reply.create({
        UserId,
        TweetId,
        comment: req.body.comment,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return res.json({
        status: 'success',
        message: `successfully replied to ${tweetAuthor.account}'s tweet`
      })
    }
    catch (error) {
      console.log(error)
    }
  },

  getReplies: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'this tweet doesn\'t exist'
        })
      }

      const replies = await Reply.findAll({ raw: true, nest: true, where: { TweetId } })
      return res.json(
        replies
      )
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = tweetController
