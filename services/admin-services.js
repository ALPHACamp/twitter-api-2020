const { Tweet, User } = require('../models')
const adminServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        console.log("測試" + tweets)
        cb(null, { tweets })
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const { UserId, description } = req.body
    if (!UserId) throw new Error('UserId is required!')
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
        //console.log("測試"+users)
        //users = Object.keys(users).map((key) => [key, users[key]])
        //users = JSON.stringify(users.users)
        console.log("admin getusers內容", users, "型別是", typeof (users))
        cb(null, { users })
      })
      .catch(err => cb(err))
  },
}
module.exports = adminServices