const { Tweet, Like, Reply, User, sequelize } = require('../models')
const helpers = require('../_helpers')

const createError = require('http-errors')

const tweetController = {
  getTweets: (req, res, next) => {
    const userId = helpers.getUser(req).id

    return Promise.all([
      Tweet.findAll({
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
        nest: true,
        raw: true
      }),
      Like.findAll({
        where: {
          user_id: userId
        }
      })
    ])
      .then(([tweets, likes]) => {
        const result = tweets.map(tweet => ({
          ...tweet,
          isLiked: likes.some(like => like.TweetId === tweet.id)
        }))

        return res.json(result)
      })
      .catch(error => next(error))
  },

  getTweet: (req, res, next) => {
    const userId = helpers.getUser(req).id

    return Promise.all([
      Tweet.findByPk(req.params.tweetId, {
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
      }),
      Like.findAll({
        where: {
          user_id: userId
        }
      })
    ])
      .then(([tweet, likes]) => {
        if (!tweet) throw createError(404, "Tweet doesn't exist!")

        const tweetData = tweet.toJSON()
        tweetData.isLiked = likes.some(like => like.TweetId === tweet.id)

        return res.json(tweetData)
      })
      .catch(error => next(error))
  },

  postTweet: (req, res, next) => {
    const { description } = req.body

    if (description.length > 140) { throw createError(422, "Description can't more than 140 words!") }
    if (!description.trim()) throw (createError(400, 'Description is required!'))

    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(newTweet => {
        const tweetData = newTweet.toJSON()
        tweetData.repliesNum = 0
        tweetData.likesNum = 0
        return res.json(tweetData)
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
        if (!replies) throw (createError(404, "Replies does'nt exist!"))

        return res.json(replies)
      })
      .catch(error => next(error))
  },

  postReply: (req, res, next) => {
    const { comment } = req.body

    if (comment.length > 140) throw (createError(422, "Comment can't more than 140 words!"))
    if (!comment.trim()) throw (createError(400, 'Comment is requires!'))

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
        if (!tweet) throw (createError(404, "Tweet doesn't exist!"))

        if (like) throw (createError(409, 'You already liked this tweet!'))

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
        if (!like) throw (createError(404, "You haven't liked this tweet!"))

        return like.destroy()
      })
      .then(deletedLike => res.json(deletedLike))
      .catch(error => next(error))
  }
}

module.exports = tweetController
