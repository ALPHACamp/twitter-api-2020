const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const adminController = {
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true })
    .then(users => {
      return res.json(users)
    })
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
    .then(tweet => {
      tweet.destroy()
      .then(() => {
        return res.json({ status: 'success', message: '' })
      })
    })
  }
}

module.exports = adminController
