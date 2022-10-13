const { User, Tweet, Like } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

// 為配合資料表外鍵設計，所以統一命名為 userId -> UserId, tweetId -> TweetId

const adminController = {
  signin: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      // sign a token (payload + key)
      if (user?.role === 'user') throw new Error('此帳號不存在')
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      delete user.password
      res.json({
        status: 'success',
        data: { token, user }
      })
    } catch (error) {
      next(error)
    }
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: Tweet },
        { model: Like },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        const userData = users.map(user => ({
          id: user.id,
          name: user.name,
          account: user.account,
          image: user.image,
          backgroundImage: user.backgroundImage,
          followingNum: user.Followings.length,
          followerNum: user.Followers.length,
          tweetNum: user.Tweets.length,
          likeNum: user.Likes.length
        }))
        userData.sort((a, b) => b.tweetNum - a.tweetNum)
        return res.status(200).json(userData)
      })
      .catch(error => next(error))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [User],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const tweetData = tweets.map(tweet => ({
          id: tweet.id,
          description: tweet.description.substring(0, 50),
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          user: {
            name: tweet.User.name,
            account: tweet.User.account,
            image: tweet.User.image
          }
        }))
        return res.status(200).json(tweetData)
      })
      .catch(error => next(error))
  },
  deleteTweet: (req, res, next) => {
    const TweetId = req.params.id
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('推文不存在')
        return tweet.destroy()
      })
      .then(tweet => {
        return res.status(200).json({
          status: 'success',
          message: '刪除推文成功',
          data: tweet
        })
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
