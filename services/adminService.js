const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

const adminService = {
  getTweets: (req, res, cb) => {
    Tweet.findAll({ include: User, raw: true, nest: true })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50)
        }))
        return cb({ tweets, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  },
  removeTweet: (req, res, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
          .then(() => cb({ status: 'success', message: '' }))
          .catch(error => res.status(422).json(error))
      })
  },
  getUsers: (req, res, cb) => {
    User.findAll({
      include: [Tweet, Like, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tweetsCount: user.Tweets.length,
          likesCount: user.Likes.length,
          followingsCount: user.Followings.length,
          followersCount: user.Followers.length
        }))
        users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
        // console.log('users', users)
        cb({ users: users, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  }
}

module.exports = adminService
