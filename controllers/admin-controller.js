const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like } = require('../models')

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
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
    })
      .then(tweets => {
        const tweetsData = tweets.map(tweet => ({
          ...tweet.toJSON(),
          description: tweet.description.substring(0, 50)
        }))
        res.json(tweetsData)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const TweetId = Number(req.params.id)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Reply.findAll({
        where: { TweetId },
        attributes: ['id']
      }),
      Like.findAll({
        where: { TweetId },
        attributes: ['id']
      })
    ])
      .then(([tweet, replies, likes]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        // 刪除與此推文相關的reply及like
        Promise.all([
          replies.map(reply => reply.destroy()),
          likes.map(like => like.destroy())
        ])
        return tweet.destroy()
      })
      .then(deletedTweet => res.json(deletedTweet))
      .catch(err => next(err))
  }
}

module.exports = adminController
