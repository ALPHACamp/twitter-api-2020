const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { User, Tweet, Like } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()

      if (userData.role !== 'admin') throw new Error('Account or password is wrong!')

      const authToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        authToken,
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: ['id', 'name', 'account', 'avatar', 'cover'],
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const usersData = users.map(user => {
          const data = {
            ...user.toJSON(),
            tweetCounts: user.Tweets.length,
            // 先取出每篇推文被like的數量, 再透過array.reduce依序加起來(達到加總的效果)
            beLikedCounts: user.Tweets.map(tweet => tweet.Likes.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
            followerCounts: user.Followers.length,
            followingCounts: user.Followings.length
          }
          delete data.Tweets
          delete data.Followers
          delete data.Followings
          return data
        })
        res.json(usersData.sort((a, b) => b.tweetCounts - a.tweetCounts))
      })
  }
}

module.exports = adminController
