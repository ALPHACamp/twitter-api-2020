const { User, Tweet, Reply, Like } = require('../models')

const tweetController = {
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }, {
            model: Reply
          }, {
            model: Like
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      const userId = req.user.id
      const returnTweets = tweets.map(tweet => {
        const returnTweet = tweet.toJSON()
        returnTweet.repliesCount = returnTweet.Replies.length
        returnTweet.likesCount = returnTweet.Likes.length
        returnTweet.isLiked = returnTweet.Likes.some(Like => Like.UserId === userId)
        return returnTweet
      })

      return cb(null, returnTweets)
    } catch (err) {
      return cb(err)
    }
  },
  getTweet: async (req, cb) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }, {
            model: Reply
          }, {
            model: Like
          }
        ],
        order: [
          [Reply, 'createdAt', 'DESC']
        ]
      })
      if (!tweet) {
        return cb(new Error('tweet_id does not exist.'))
      }
      const userId = req.user.id
      const returnTweet = tweet.toJSON()
      returnTweet.repliesCount = returnTweet.Replies.length
      returnTweet.likesCount = returnTweet.Likes.length
      returnTweet.isLiked = returnTweet.Likes.some(Like => Like.UserId === userId)
      return cb(null, returnTweet)
    } catch (err) {
      return cb(err)
    }
  },
  postTweet: async (req, cb) => {
    try {
      const { description } = req.body
      const UserId = req.user.id
      if (!description) {
        return cb(new Error('Description is required.'))
      } else if (description.length > 140) {
        return cb(new Error('Description is longer than 140 words.'))
      }
      const newTweet = await Tweet.create({
        description,
        UserId
      })
      const tweetData = {
        status: 'success',
        data: {
          Tweet: newTweet.dataValues
        }
      }
      return cb(null, tweetData)
    } catch (err) {
      return cb(err)
    }
  },
  postLike: async (req, cb) => {
    try {
      const UserId = req.user.id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return cb(new Error('tweet_id does not exist.'))
      }

      const findLike = await Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })

      if (findLike) {
        return cb(null, {
          status: 'success',
          isLiked: true,
          message: 'This tweet is already liked.'
        })
      }

      const newLike = await Like.create({
        UserId,
        TweetId
      })

      const likeData = {
        status: 'success',
        isLiked: true,
        data: {
          Like: newLike.dataValues
        }
      }
      return cb(null, likeData)
    } catch (err) {
      return cb(err)
    }
  },
  postUnlike: async (req, cb) => {
    try {
      const UserId = req.user.id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return cb(new Error('tweet_id does not exist.'))
      }

      const findLike = await Like.findOne({
        where: {
          UserId,
          TweetId
        }
      })
      if (!findLike) {
        return cb(null, {
          status: 'success',
          isLiked: false,
          message: 'This tweet is not liked.'
        })
      }
      const deletedLike = await findLike.destroy()

      const likeData = {
        status: 'success',
        isLiked: false,
        data: {
          Like: deletedLike.dataValues
        }
      }
      return cb(null, likeData)
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = tweetController
