const { Tweet, User } = require('../models')
const dayjs = require('dayjs')

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime)
const adminServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
    })

      .then(tweets => {
        for (let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
        }
        cb(null, tweets);
      })
      .catch(err => cb(err))
  },

  postTweet: (req, cb) => {
    const { UserId, description } = req.body
    if (!UserId) res.status(500).json({
      status: 'error',
      data: {
        'Error Message': 'userId is required'
      }
    })
    const { file } = req
    Tweet.create({ UserId, description })
      .then(newTweet => cb(null, { tweet: newTweet }))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { Tweet: deletedTweet }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    User.findAll({
      raw: true,
    })
      .then(users => {


        cb(null, users)


      })
      .catch(err => cb(err))
  },
}
module.exports = adminServices