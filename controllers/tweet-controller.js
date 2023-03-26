const { Tweet, Like, Reply, User, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['created_at', 'desc']],
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`tweet_id` = `Tweet`.`id`)'
            ),
            'likesNum'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`tweet_id` = `Tweet`.`id`)'
            ),
            'repliesNum'
          ]
        ]
      },
      nest: true
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          const tweetData = tweet.toJSON()
          return tweetData
        })

        return res.json(tweets)
      })
      .catch(error => next(error))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId, {
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM `Likes` WHERE `Likes`.`tweet_id` = `Tweet`.`id`)'
            ),
            'likesNum'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM `Replies` WHERE `Replies`.`tweet_id` = `Tweet`.`id`)'
            ),
            'repliesNum'
          ]
        ]
      }
    })
      .then(tweet => {
        if (!tweet) {
          const error = new Error("Tweet doesn't exist!")
          error.status = 404
          throw error
        }

        return res.json(tweet)
      })
      .catch(error => next(error))
  },

  postTweet: (req, res, next) => {
    const { description } = req.body

    if (!description.trim()) {
      const error = new Error('Description is required!')
      error.status = 404
      throw error
    }

    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(newTweet => {
        return res.json(newTweet)
      })
      .catch(error => next(error))
  },

  getReplies: (req, res, next) => {
    return Reply.findAll({
      where: {
        TweetId: req.params.tweetId
      },
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }],
      raw: true,
      nest: true
    })
      .then(replies => {
        if (!replies) {
          const error = new Error("Replies does'nt exist!")
          error.status = 404
          throw error
        }

        return res.json(replies)
      })
      .catch(error => next(error))
  },

  postReply: (req, res, next) => {
    const { comment } = req.body

    if (!comment.trim()) {
      const error = new Error('Comment is requires!')
      error.status = 404
      throw error
    }

    return Reply.create({
      UserId: helpers.getUser(req).id,
      comment,
      TweetId: req.params.tweetId
    })
      .then(newReply => res.json(newReply))
      .catch(error => next(error))
  },

  addLike: (req, res, next) => {
    const { tweetId } = req.params

    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) {
          const error = new Error("Tweet doesn't exist!")
          error.status = 404
          throw error
        }

        if (like) {
          const error = new Error('You already liked this tweet!')
          error.status = 404
          throw error
        }

        return Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: tweetId
        })
      })
      .then(newLike => res.json(newLike))
      .catch(error => next(error))
  },

  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) {
          const error = new Error("You haven't liked this tweet!")
          error.status = 404
          throw error
        }

        return like.destroy()
      })
      .then(deletedLike => res.json(deletedLike))
      .catch(error => next(error))
  }
}

module.exports = tweetController
