const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [
        User,
        { model: Like, include: User },
        { model: Reply, include: User }
      ]
    })
      .then(tweets => {

        const result = tweets.map(tweet => ({
          ...tweet.toJSON(),
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length
        }))
          .map(tweet => {
            if (tweet.Replies.length !== 0) {
              tweet.Replies.map(
                reply => delete reply.User.password
              )}
              
            if (tweet.User) delete tweet.User.password

            return tweet
          })

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  addTweet: (req, res, next) => {

    const { description } = req.body

    if (description.length === 0) {
      return res.status(403).json({
        status: 'error',
        message: '請輸入你想分享的內容'
      })
    }

    if (description.length > 140) {
      return res.status(403).json({
        status: 'error',
        message: '分享太多內容囉~~~ 上限140個字'
      })
    }

    Tweet.create({
      userId: helpers.getUser(req).id,
      description
    })

    return res.status(200).json({
      status: 'success',
      message: '推文已成功新增'
    })
  },
  getTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id,
      {
        include: [
          User,
          { model: Like, include: User },
          { model: Reply, include: User }
        ]
      })
      .then(tweet => {

        if (!tweet) {
          return res.status(403).json({
            status: 'error',
            message: '此推文已消失在這世上'
          })
        }

        const isLike = tweet.Likes.some(l => l.id === helpers.getUser(req).id)
        const result = ({
          ...tweet.toJSON(),
          likeCount: tweet.Likes.length,
          commentCount: tweet.Replies.length,
          isLike
        })

        if (result.Replies) {
          result.Replies.map(
            reply => delete reply.User.password
          )
        }
        if (result.User) delete result.User.password

        return result
      })
      .then(data => res.status(200).json(data))
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    Promise.all([
      Tweet.findByPk(req.params.id,)
    ])
  },
  addReply: (req, res, next) => {

  }
}


module.exports = tweetController
