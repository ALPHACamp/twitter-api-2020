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

      if (!description.trim()) {
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

      const tweet = await Tweet.create({
        UserId,
        description
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
      const { tweet_id: TweetId } = req.params
      let tweet = await Tweet.findByPk(TweetId, {
        include: [User, Like, Reply]
      })

      if (!tweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: 'this tweet doesn\'t exist'
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
      const { tweet_id: TweetId } = req.params
      const targetTweet = await Tweet.findByPk(TweetId)

      if (!targetTweet) {
        return res
          .status(204)
          .json({
            status: 'error',
            message: 'cannot like a tweet that doesn\'t exist'
          })
      }

      const like = await Like.findOne({ where: { TweetId, UserId } })

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
        TweetId
      })

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

  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = req.user.id
      const { tweet_id: TweetId } = req.params
      const targetTweet = await Tweet.findByPk(TweetId)

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
          TweetId
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
      const { tweet_id: TweetId } = req.params
      const targetTweet = await Tweet.findByPk(TweetId)
      const UserId = req.user.id
      const { comment } = req.body

      if (!targetTweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'cannot reply to a tweet that doesn\'t exist'
          })
      }

      const tweetAuthor = await User.findByPk(targetTweet.UserId)

      if (!comment.trim()) {
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
        comment
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
      const { tweet_id: TweetId } = req.params
      const targetTweet = await Tweet.findByPk(TweetId)

      if (!targetTweet) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: 'this tweet doesn\'t exist'
          })
      }

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId }
      })

      return res
        .status(200)
        .json(replies)
    }
    catch (error) {
      next(error)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const { tweet_id: TweetId } = req.params
      const tweet = await Tweet.findByPk(TweetId)

      if (!tweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'this tweet doesn\'t exist'
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

      await Promise.all([
        Reply.destroy({ where: { TweetId: tweet.id } }),
        Like.destroy({ where: { TweetId: tweet.id } }),
        tweet.destroy()
      ])

      res
        .status(200)
        .json({
          status: 'success',
          message: 'delete successfully'
        })

    } catch (err) {
      next(error)
    }
  },

  editTweet: async (req, res, next) => {
    try {
      const { tweet_id: TweetId } = req.params
      let tweet = await Tweet.findByPk(TweetId)
      const { description } = req.body

      if (!tweet) {
        return res
          .status(200)
          .json({
            status: 'error',
            message: 'this tweet doesn\'t exist'
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
        description: description.trim() ? description : tweet.description,
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
      const { tweet_id: TweetId, reply_id: ReplyId } = req.params
      const UserId = req.user.id
      const { comment } = req.body
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
          .json({
            status: 'error',
            message: 'this reply does not exist or belong to you'
          })
      }

      if (!comment.trim()) {
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
        comment,
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
      const { tweet_id: TweetId, reply_id: ReplyId } = req.params
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
          .json({
            status: 'error',
            message: 'this reply does not exist or belong to you'
          })
      }

      await reply.destroy()

      return res
        .status(200)
        .json({
          status: 'success',
          message: 'successfully deleted your response',
          deletedReplyId: ReplyId
        })
    }
    catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
