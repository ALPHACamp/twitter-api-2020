const helpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User,
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(tweets => {
        // const data = { tweets }
        // res.json({ status: 'success', data })
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Promise.all([
      Tweet.findOne(
        {
          where: { id: req.params.tweet_id },
          raw: true
        }),
      Like.findAll({ where: { tweetId: req.params.tweet_id } }),
      Reply.findAll({ where: { tweetId: req.params.tweet_id } })
    ])
      .then(([tweet, likes, replies]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return User.findByPk(tweet.userId)
          .then(user => {
            res.json({
              ...tweet,
              userName: user.name,
              replyAmount: replies.length,
              likeAmount: likes.length
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  postTweets: (req, res, next) => {
    const { description } = req.body
    if (description.length > 120) throw new Error('description is limited to 120 words!')
    if (!description.trim()) throw new Error('description can not be blank!')
    if (!description) throw new Error('description is required!')
    return Tweet.create({
      description,
      UserId: helpers.getUser(req).id
    })
      .then(newTweet => {
        res.json({ newTweet })
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    return Promise.all([
      Like.findOne({
        where: {
          userId: helpers.getUser(req).id,
          tweetId: req.params.id
        }
      }),
      Tweet.findByPk(req.params.id)
    ])
      .then(([like, tweet]) => {
        if (!tweet) throw new Error("The tweet didn't exist!")
        if (like) throw new Error('You have already liked this tweet!')
        Like.create({
          tweetId: req.params.id,
          userId: helpers.getUser(req).id
        })
          .then(() => {
            res.json({
              ...tweet.toJSON(),
              islike: true
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Promise.all([
      Like.findOne({
        where: {
          userId: helpers.getUser(req).id,
          tweetId: req.params.id
        }
      }),
      Tweet.findByPk(req.params.id)
    ])
      .then(([like, tweet]) => {
        if (!tweet) throw new Error("The tweet didn't exist!")
        if (!like) throw new Error("'You haven't liked this tweet!")
        return like.destroy()
          .then(() => {
            res.json({
              ...tweet.toJSON(),
              islike: false
            })
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  },
  replyTweet: (req, res, next) => {
    return Reply.create({
      comment: req.body.comment,
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id
    })
      .then(newReply => {
        res.json( newReply )
      })
      .catch(err => next(err))
  }
}
module.exports = tweetController
