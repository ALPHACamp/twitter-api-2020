const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    if (req.user.role === 'user') throw new Error("User doen't have permission!") //   一般 user 不能登入
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [Tweet, Like, { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] }]
    })
      .then(users => {
        const data = users.map(user => ({
          ...user.toJSON(),
          Tweets: user.Tweets.length,
          Likes: user.Likes.length,
          Followers: user.Followers.length,
          Followings: user.Followings.length
        })
        )
        return data
      })
      .then(data => {
        res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            data
          },
          message: 'All users found!'
        })
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const DEFAULT_DESCRIPTION_LIMIT = 140
    return Tweet.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: User, as: 'LikedUsers', attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Reply, attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const likedTweetId = req.user?.LikedTweets ? req.user.LikedTweets.map(likeTweet => likeTweet.id) : []
        const resultTweets = tweets.rows.map(r => ({
          ...r.toJSON(),
          description: r.description.substring(0, DEFAULT_DESCRIPTION_LIMIT),
          Likes: r.LikedUsers ? r.LikedUsers.length : 0,
          Replies: r.Replies ? r.Replies.length : 0,
          isLiked: likedTweetId.includes(r.id)
        }))
        return res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            tweets: resultTweets
          },
          message: ''
        })
      })
      .catch(err => next(err))
  },
  deleteTweets: (req, res, next) => {
    const id = req.params.id
    return Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.json({
        status: 'Success',
        statusCode: 200,
        message: 'Tweet deleted!'
      }))
      .catch(err => next(err))
  }
}

module.exports = adminController
