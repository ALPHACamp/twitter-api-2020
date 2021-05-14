const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  postTweets: async (req, res, next) => {
    try {
      let { description } = req.body
      const UserId = req.user.id

      if (!description) {
        return res
          .status(422)
          .json({
            status: 'error',
            message: 'input should not be blank'
          })
      }

      if (description.length > 140) {
        return res
          .status(422)
          .json({
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

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'successfully posted a tweet',
          tweet
        })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User, Reply, Like],
        order: [['createdAt', 'DESC']]
      })

      const likes = helpers.getUserInfoId(req, 'LikedTweets')

      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        slicedDescription: tweet.description.trim().slice(0, 50),
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: likes ? likes.includes(tweet.id) : null,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res
        .status(200)
        .json(tweets)
    } catch (error) {
      next(error)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      let tweet = await Tweet.findByPk(TweetId, {
        include: [User, Like, Reply]
      })

      if (!tweet) {
        return res
          .status(404)
          .json({
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
          account: tweet.User.account,
          avatar: tweet.User.avatar
        },
        likesLength: tweet.Likes.length,
        commentsLength: tweet.Replies.length,
        isLiked: likes ? likes.includes(tweet.id) : null
      }

      return res
        .status(200)
        .json(tweet)
    } catch (error) {
      next(error)
    }
  },

  likeTweet: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const targetTweet = await Tweet.findOne({ where: { id: req.params.tweet_id } })

      if (!targetTweet) {
        return res
          .status(204)
          .json({
            status: 'error',
            message: 'cannot like a tweet that doesn\'t exist'
          })
      }

      const like = await Like.findOne({ where: { TweetId: req.params.tweet_id, UserId } })

      if (like) {
        return res
          .status(409)
          .json({
            status: 'error',
            message: 'already liked this tweet'
          })
      }

      await Like.create({
        UserId,
        TweetId: req.params.tweet_id
      })

      return res
        .status(200)
        .json({ status: 'success' })
    }
    catch (error) {
      next(error)
    }
  },

  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const targetTweet = await Tweet.findOne({ where: { id: req.params.tweet_id } })

      if (!targetTweet) {
        return res
          .status(204)
          .json({
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
        return res
          .status(409)
          .json({
            status: 'error',
            message: 'you haven\'t liked this tweet before'
          })
      }

      await like.destroy()

      return res
        .status(200)
        .json({
          status: 'success'
        })
    }
    catch (error) {
      next(error)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })
      const UserId = req.user.id

      if (!targetTweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'cannot reply to a tweet that doesn\'t exist'
          })
      }

      const tweetAuthor = await User.findOne({ where: { id: targetTweet.UserId } })

      if (!req.body.comment.trim()) {
        return res
          .status(422)
          .json({
            status: 'error',
            message: 'comment cannot be blank'
          })
      }

      const reply = await Reply.create({
        UserId,
        TweetId,
        comment: req.body.comment,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: `successfully replied to ${tweetAuthor.account}'s tweet`,
          ReplyId: reply.id
        })
    }
    catch (error) {
      next(error)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })

      if (!targetTweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: 'tweet does not exist'
          })
      }

      const replies = await Reply.findAll({ raw: true, nest: true, where: { TweetId } })
      return res
        .status(200)
        .json(
          replies
        )
    }
    catch (error) {
      next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id)

      if (!tweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'tweet does not exist'
          })
      }

      if (tweet.UserId !== req.user.id) {
        return res
          .status(403)
          .json({
            status: 'error',
            message: 'you cannot delete other user\'s tweet'
          })
      }

      // Replies and likes related to this tweet must be deleted as well
      await Promise.all([
        Reply.destroy({ where: { TweetId: tweet.id } }),
        Like.destroy({ where: { TweetId: tweet.id } }),
        tweet.destroy()
      ])

      res
        .status(200)
        .json({ status: 'success', message: 'delete successfully' })

    } catch (err) {
      next(error)
    }
  },

  editTweet: async (req, res, next) => {
    try {
      let tweet = await Tweet.findByPk(req.params.tweet_id)
      const { description } = req.body

      if (!tweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'tweet does not exist'
          })
      }

      if (tweet.UserId !== req.user.id) {
        return res
          .status(403)
          .json({
            status: 'error',
            message: 'you cannot edit other user\'s tweet'
          })
      }

      if (description.length > 140) {
        return res
          .status(422)
          .json({
            status: 'error',
            message: 'input cannot be longer than 140 characters'
          })
      }

      await tweet.update({
        id: tweet.id,
        UserId: tweet.UserId,
        description,
        createdAt: tweet.createdAt,
        updatedAt: new Date()
      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'successfully updated tweet',
          editedTweetId: tweet.id
        })
    }
    catch (error) {
      next(error)
    }
  },

  editReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const ReplyId = req.params.reply_id
      const UserId = req.user.id
      const reply = await Reply.findOne({
        where: {
          id: ReplyId,
          UserId,
          TweetId
        }
      })

      if (!reply) {
        return res
          .status(400)
          .json({ status: 'error', message: 'this reply does not exist or belong to you' })
      }

      if (!req.body.comment.trim()) {
        return res
          .status(422)
          .json({
            status: 'error',
            message: 'comment cannot be blank'
          })
      }

      await reply.update({
        id: reply.id,
        UserId,
        TweetId,
        comment: req.body.comment,
        createdAt: reply.createdAt,
        updatedAt: new Date()
      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'successfully updated your response',
          updatedReplyId: reply.id
        })
    }
    catch (error) {
      next(error)
    }
  },

  deleteReply: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const replyId = req.params.reply_id
      const UserId = req.user.id
      const reply = await Reply.findOne({
        where: {
          id: replyId,
          UserId,
          TweetId
        }
      })

      if (!reply) {
        return res
          .status(400)
          .json({ status: 'error', message: 'this reply does not exist or belong to you' })
      }

      await reply.destroy()

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'successfully deleted your response',
          deletedReplyId: replyId
        })
    }
    catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
