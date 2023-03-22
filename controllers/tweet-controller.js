const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) throw new Error('description is required')

    const user = helpers.getUser(req)
    const UserId = user.id

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Tweet.create({
          UserId,
          description
        })
      })
      .then(tweet => {
        res.json({
          tweet
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: { model: User },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const id = req.params.tweet_id

    return Tweet.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Like, attributes: ['deleted'] }
      ],
      raw: true,
      nest: true
    })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")

        res.json(tweet)
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment) throw new Error('comment is required')

    const user = helpers.getUser(req)
    const UserId = user.id
    const TweetId = req.params.tweet_id

    return User.findByPk(UserId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Reply.create({
          UserId,
          TweetId,
          comment
        })
      })
      .then(reply => res.json({
        reply
      }))
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const id = req.params.tweet_id

    return Reply.findAll({
      where: { TweetId: id },
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        {
          model: Tweet,
          attributes: ['UserId'],
          include: { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(replies => res.json(replies))
      .catch(err => next(err))
  }
}

module.exports = tweetController
