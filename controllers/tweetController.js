const { Reply, Tweet, User, Like, Sequelize } = require('../models')
const { Op } = Sequelize

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.user.id, {
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
        ]
      })
      let followers = user.Followers.map(user => { return user.id })
      let tweets = await Tweet.findAll({
        where: { UserId: followers }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      let tweet = await Tweet.findByPk(id,
        { include: [User, Like, Reply] }
      )

      if (!tweet) {
        return res.status(409).json({
          status: 'error',
          message: 'You didn\'t like the tweet'
        })
      }

      tweet = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCounts: tweet.Replies.length,
        likeCounts: tweet.Likes.length,
        isLike: req.user.LikedTweets.map(like => like.id).includes(tweet.id),
        user: {
          name: tweet.User.name,
          avatar: tweet.User.avatar,
          account: tweet.User.account,
        }
      }
      return res.status(200).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: 'Can not find this tweet!'
          })
        }
        if (tweet.UserId !== req.user.id) {
          return res.status(403).json({
            status: 'error',
            message: 'you can not delete this tweet!'
          })
        }
        Promise.all([
          tweet.destroy(),
          Reply.destroy({ where: { TweetId: tweet.id } }),
          Like.destroy({ where: { TweetId: tweet.id } })
        ])
          .then(() => {
            res.status(200).json({
              status: 'success',
              message: 'delete successfully'
            })
          }).catch(err => next(err))
      }).catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description.trim()) {
      return res.status(404).json({
        status: 'error',
        message: 'Tweet can not be blank!'
      })
    }
    Tweet.create({
      description: description,
      UserId: req.user.id
    })
      .then(() => {
        res.status(200).json({
          status: 'success',
          message: 'Successfully posted'
        })
      }).catch(err => next(err))
  },
  putTweet: (req, res, next) => {
    const { description } = req.body
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({
            status: 'error',
            message: 'Can not find this tweet!'
          })
        }
        if (tweet.UserId !== req.user.id) {
          return res.status(403).json({
            status: 'error',
            message: 'you can not edit this tweet!'
          })
        }
        tweet.update({
          id: tweet.id,
          UserId: tweet.UserId,
          description: description,
        })
        return res.status(200).json({
          status: 'success',
          message: 'edit successfully'
        })
      }).catch(err => next(err))
  },
  postReply: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)
      const { comment } = req.body

      if (!tweet) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }

      if (!comment.trim()) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not be blank!'
        })
      }

      const reply = await Reply.create({
        UserId: req.user.id,
        TweetId: tweetId,
        comment: comment
      })

      return res.status(200).json({
        status: 'success',
        message: 'post reply successfully'
      })

    } catch (err) {
      next(err)
    }

  },
  getReply: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: tweetId }
      })

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params

      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: tweetId
        }
      })

      if (like) {
        return res.status(409).json({
          status: 'error',
          message: 'already liked'
        })
      }
      await Like.create({
        UserId: req.user.id,
        TweetId: tweetId
      })

      return res.status(200).json({
        status: 'success',
        message: 'Add like successfully'
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const { tweetId } = req.params

      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: tweetId
        }
      })

      if (!like) {
        return res.status(409).json({
          status: 'error',
          message: 'You didn\'t like the tweet'
        })
      }

      await like.destroy()

      return res.status(200).json({
        status: 'success',
        message: 'Remove like successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController